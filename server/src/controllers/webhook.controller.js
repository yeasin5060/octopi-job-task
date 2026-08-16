import Stripe from "stripe";

import { User } from "../models/user.model.js";
import { Organization } from "../models/organization.model.js";
import { Plan } from "../models/plan.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Payment } from "../models/payment.model.js";
import { Transaction } from "../models/transaction.model.js";
import { StripeEvent } from "../models/stripeEvent.model.js";
import { PendingRegistration } from "../models/pendingRegistration.model.js";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);

// ==========================================
// Stripe Webhook
// ==========================================

export const handleStripeWebhook = async (req, res) => {
  let event;
  console.log("🔥 STRIPE WEBHOOK REQUEST RECEIVED");
  try {
    const signature = req.headers["stripe-signature"];

    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(
      "Stripe signature error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message: "Invalid Stripe webhook",
    });
  }

  try {
    // Prevent duplicate event
    const existingEvent = await StripeEvent.findOne({
      eventId: event.id,
    });

    if (existingEvent) {
      return res.status(200).json({
        received: true,
        duplicate: true,
      });
    }

    await StripeEvent.create({
      eventId: event.id,
      type: event.type,
      processed: false,
    });

    // Checkout completed
    if (
      event.type === "checkout.session.completed"
    ) {
      const session = event.data.object;

      await processSuccessfulCheckout(session);
    }

    await StripeEvent.findOneAndUpdate(
      {
        eventId: event.id,
      },
      {
        processed: true,
        processedAt: new Date(),
      }
    );

    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error(
      "Webhook processing error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
};

// ==========================================
// Process Successful Checkout
// ==========================================

const processSuccessfulCheckout = async (session) => {

  console.log("\n================ STRIPE WEBHOOK ================");
  console.log("SESSION ID:", session.id);
  console.log("PAYMENT STATUS:", session.payment_status);
  console.log("SESSION STATUS:", session.status);
  console.log("METADATA:", session.metadata);
  console.log("CUSTOMER:", session.customer);
  console.log("SUBSCRIPTION:", session.subscription);
  console.log("AMOUNT TOTAL:", session.amount_total);
  const {
    pendingRegistrationId,
    planId,
  } = session.metadata || {};

  if (!pendingRegistrationId || !planId) {
    throw new Error(
      "Missing Stripe metadata"
    );
  }

  // ========================================
  // Find Pending Registration
  // ========================================

  const pendingRegistration =
    await PendingRegistration.findById(
      pendingRegistrationId
    ).select("+password");

  if (!pendingRegistration) {
    throw new Error(
      "Pending registration not found"
    );
  }

  // ========================================
  // Check Existing User
  // ========================================

  const existingUser = await User.findOne({
    email: pendingRegistration.email,
  });

  if (existingUser) {
    console.log(
      "User already exists:",
      existingUser.email
    );

    return;
  }

  // ========================================
  // Find Plan
  // ========================================

  const plan = await Plan.findOne({
    _id: planId,
    isActive: true,
  });

  if (!plan) {
    throw new Error(
      "Plan not found"
    );
  }

  // ========================================
  // Create Organization
  // ========================================

  const organization =
    await Organization.create({
      name:
        pendingRegistration.organizationName,

      contactEmail:
        pendingRegistration.email,

      billingEmail:
        pendingRegistration.email,

      status: "ACTIVE",

      stripeCustomerId:
        session.customer || null,
    });

  console.log(
    "Organization created:",
    organization._id
  );

  // ========================================
  // Create User
  // ========================================

  const user = await User.create({
    name: pendingRegistration.adminName,

    email: pendingRegistration.email,

    password: pendingRegistration.password,


    status: "ACTIVE",

    organizationId:
      organization._id,
  });

  console.log(
    "User created:",
    user._id
  );

  // ========================================
  // Create Subscription
  // ========================================

  const subscription =
    await Subscription.create({
      organizationId: organization._id,

      planId: plan._id,

      stripeSubscriptionId: session.subscription || null,

      status: "ACTIVE",
    });

  console.log(
    "Subscription created:",
    subscription._id
  );

// ==========================================
// Create Payment
// ==========================================

const payment =
  await Payment.create({
    userId:
      user._id,

    organizationId:
      organization._id,

    subscriptionId:
      subscription._id,

    amount:
      (session.amount_total || 0) / 100,

    currency:
      session.currency,

    status:
      "SUCCESS",

    stripePaymentIntentId:
      session.payment_intent || null,

    stripeCheckoutSessionId:
      session.id,
  });

console.log(
  "Payment created:",
  payment._id
);

// ==========================================
// Create Transaction
// ==========================================

const transaction =
  await Transaction.create({
    organizationId:
      organization._id,

    paymentId:
      payment._id,

    amount:
      payment.amount,

    type:
      "SUBSCRIPTION_PAYMENT",

    status:
      "SUCCESS",

    description:
      `Subscription payment for ${plan.name}`,
  });

console.log(
  "Transaction created:",
  transaction._id
);

  // ========================================
  // Delete Pending Registration
  // ========================================

  await PendingRegistration.findByIdAndDelete(
    pendingRegistration._id
  );

  console.log(
    "===================================="
  );

  console.log(
    "✅ Registration completed successfully"
  );

  console.log({
    organizationId: organization._id,

    userId: user._id,

    subscriptionId: subscription._id,

    paymentId: payment._id,
  });

  console.log(
    "===================================="
  );
};