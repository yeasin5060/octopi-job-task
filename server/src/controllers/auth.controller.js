import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Stripe from "stripe";

import {User} from "../models/user.model.js";
import {Plan} from "../models/plan.model.js";
import {PasswordReset} from "../models/passwordReset.model.js";
import { PendingRegistration } from "../models/pendingRegistration.model.js";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);

// ==========================================
// Generate JWT
// ==========================================

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      organizationId: user.organizationId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

// ==========================================
// Register
// ==========================================

export const register = async (req, res, next) => {
  try {
    const {
      organizationName,
      adminName,
      email,
      password,
      planId,
    } = req.body;

    // ==========================================
    // Validate
    // ==========================================

    if (
      !organizationName ||
      !adminName ||
      !email ||
      !password ||
      !planId
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    // ==========================================
    // Check Existing User
    // ==========================================

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // ==========================================
    // Check Plan
    // ==========================================

    const plan = await Plan.findOne({
      _id: planId,
      isActive: true,
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Selected plan not found",
      });
    }

    console.log("PLAN:", {
      id: plan._id,
      name: plan.name,
      price: plan.price,
      currency: plan.currency,
      interval: plan.billingInterval,
    });

    // ==========================================
    // Hash Password
    // ==========================================

    const hashedPassword =
      await bcrypt.hash(password, 12);

    // ==========================================
    // Create Pending Registration
    // ==========================================

    const pendingRegistration =
      await PendingRegistration.create({
        organizationName:
          organizationName.trim(),

        adminName:
          adminName.trim(),

        email:
          normalizedEmail,

        password:
          hashedPassword,

        planId:
          plan._id,

        expiresAt:
          new Date(
            Date.now() +
              30 * 60 * 1000
          ),
      });

    console.log(
      "Pending Registration Created:",
      pendingRegistration._id
    );

    // ==========================================
    // Create Stripe Checkout
    // ==========================================

    const checkoutSession =
      await stripe.checkout.sessions.create({
        mode: "subscription",

        customer_email:
          normalizedEmail,

        line_items: [
          {
            price_data: {
              currency:
                plan.currency.toLowerCase(),

              product_data: {
                name:
                  plan.name,
              },

              unit_amount:
                Math.round(
                  Number(plan.price) * 100
                ),

              recurring: {
                interval:
                  plan.billingInterval ===
                  "YEARLY"
                    ? "year"
                    : "month",
              },
            },

            quantity: 1,
          },
        ],

        metadata: {
          pendingRegistrationId:
            pendingRegistration._id.toString(),

          planId:
            plan._id.toString(),
        },

        success_url:
          `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${process.env.CLIENT_URL}/payment/cancel`,
      });

    console.log(
      "Stripe Checkout Created:",
      checkoutSession.id
    );

    // ==========================================
    // Save Stripe Session ID
    // ==========================================

    pendingRegistration.stripeCheckoutSessionId =
      checkoutSession.id;

    await pendingRegistration.save();

    console.log(
      "Stripe Session Saved"
    );

    // ==========================================
    // Response
    // ==========================================

    return res.status(201).json({
      success: true,

      message:
        "Registration created. Please complete payment.",

      checkoutUrl:
        checkoutSession.url,

      registrationId:
        pendingRegistration._id,
    });

  } catch (error) {

    console.error(
      "REGISTER ERROR:",
      error
    );

    next(error);
  }
};
// ==========================================
// Login
// ==========================================

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check user status
    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Account is not active",
      });
    }

    // Update login time
    user.lastLoginAt = new Date();

    await user.save();

    // Generate JWT
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId:
          user.organizationId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get Current User
// ==========================================

export const me = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

// ==========================================
// Forgot Password
// ==========================================

export const forgotPassword = async (
  req,
  res,
  next
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Don't reveal whether email exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If the email exists, a reset link has been sent.",
      });
    }

    // Delete previous reset tokens
    await PasswordReset.deleteMany({
      userId: user._id,
    });

    // Generate token
    const token = crypto
      .randomBytes(32)
      .toString("hex");

    // Save reset token
    await PasswordReset.create({
      userId: user._id,

      token,

      expiresAt: new Date(
        Date.now() + 15 * 60 * 1000
      ),
    });

    // TODO:
    // Send email using Nodemailer / Resend
    //
    // const resetUrl =
    // `${process.env.CLIENT_URL}/reset-password/${token}`;

    return res.status(200).json({
      success: true,
      message:
        "If the email exists, a reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Reset Password
// ==========================================

export const resetPassword = async (
  req,
  res,
  next
) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    // Find valid token
    const resetRequest =
      await PasswordReset.findOne({
        token,
        expiresAt: {
          $gt: new Date(),
        },
        usedAt: null,
      });

    if (!resetRequest) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired reset token",
      });
    }

    // Find user
    const user = await User.findById(
      resetRequest.userId
    ).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Hash new password
    const hashedPassword =
      await bcrypt.hash(password, 12);

    user.password = hashedPassword;

    await user.save();

    // Mark token as used
    resetRequest.usedAt = new Date();

    await resetRequest.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};