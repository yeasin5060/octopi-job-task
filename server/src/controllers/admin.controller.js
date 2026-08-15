
import { Organization } from "../models/organization.model.js";
import { Payment } from "../models/payment.model.js";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import {Transaction} from '../models/transaction.model.js'

export const getStats = async (req,res,next) => {
  try {
    const [
      totalOrganizations,
      totalUsers,
      activeSubscriptions,
      successfulPayments,
      failedPayments,
    ] = await Promise.all([
      Organization.countDocuments(),

      User.countDocuments(),

      Subscription.countDocuments({
        status: "ACTIVE",
      }),

      Payment.countDocuments({
        status: "SUCCESS",
      }),

      Payment.countDocuments({
        status: "FAILED",
      }),
    ]);

    const revenueResult =
      await Payment.aggregate([
        {
          $match: {
            status: "SUCCESS",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$amount",
            },
          },
        },
      ]);

    const recentSignups =
      await Organization.find()
        .sort({ createdAt: -1 })
        .limit(10);

    res.json({
      success: true,

      stats: {
        totalOrganizations,
        totalUsers,
        activeSubscriptions,
        successfulPayments,
        failedPayments,
        totalRevenue:
          revenueResult[0]?.totalRevenue || 0,
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