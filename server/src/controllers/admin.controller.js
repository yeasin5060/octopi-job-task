
import { Organization } from "../models/organization.model.js";
import { Payment } from "../models/payment.model.js";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import {Transaction} from '../models/transaction.model.js'
import jwt from "jsonwebtoken";

import bcrypt from "bcryptjs";

// ==========================================
// Create Platform Admin
// ==========================================

export const createPlatformAdmin = async (req, res, next) => {
    try {
      const {name,email,password,} = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message:
            "Name, email and password are required",
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

      const existingUser =
        await User.findOne({
          email: normalizedEmail,
        });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message:
            "Email already registered",
        });
      }

      const hashedPassword =
        await bcrypt.hash(password, 12);

      const admin = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: "PLATFORM_ADMIN",
        status: "ACTIVE",
        organizationId: null,
      });

      return res.status(201).json({
        success: true,
        message:
          "Platform Admin created successfully",
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          status: admin.status,
        },
      });
    } catch (error) {
      next(error);
    }
};

// ==========================================
// Dashboard Stats
// ==========================================

export const getDashboardStats =
  async (req, res, next) => {
    try {
      const [
        totalOrganizations,
        totalUsers,
        activeSubscriptions,
        totalRevenue,
        failedPayments,
        recentSignups,
      ] = await Promise.all([
        Organization.countDocuments(),

        User.countDocuments(),

        Subscription.countDocuments({
          status: "ACTIVE",
        }),

        Payment.aggregate([
          {
            $match: {
              status: "SUCCESS",
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$amount",
              },
            },
          },
        ]),

        Payment.countDocuments({
          status: "FAILED",
        }),

        Organization.find()
          .sort({ createdAt: -1 })
          .limit(10)
          .select("name status createdAt"),
      ]);

      return res.json({
        success: true,
        stats: {
          totalOrganizations,
          totalUsers,
          activeSubscriptions,
          totalRevenue:
            totalRevenue[0]?.total || 0,
          failedPayments,
          recentSignups,
        },
      });
    } catch (error) {
      next(error);
    }
  };


export const updateOrganizationStatus = async (
  req,
  res,
  next
) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Allowed status
    const allowedStatuses = [
      "ACTIVE",
      "SUSPENDED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid organization status",
      });
    }

    // Find organization
    const organization =
      await Organization.findById(id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    // Prevent unnecessary update
    if (organization.status === status) {
      return res.status(400).json({
        success: false,
        message: `Organization is already ${status}`,
      });
    }

    // Update status
    organization.status = status;

    await organization.save();

    return res.status(200).json({
      success: true,
      message:
        status === "SUSPENDED"
          ? "Organization suspended successfully"
          : "Organization reactivated successfully",

      organization: {
        id: organization._id,
        name: organization.name,
        status: organization.status,
      },
    });
  } catch (error) {
    next(error);
  }
};