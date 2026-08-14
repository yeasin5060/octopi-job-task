
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