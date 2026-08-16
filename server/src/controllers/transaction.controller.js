import { Transaction } from "../models/transaction.model.js";

// ==========================================
// Get My Transactions
// ORG ADMIN / MEMBER
// ==========================================

export const getMyTransactions = async (
  req,
  res,
  next
) => {
  try {
    const {
      status,
      startDate,
      endDate,
    } = req.query;

    // ======================================
    // Organization Filter
    // ======================================

    const filter = {
      organizationId:
        req.user.organizationId,
    };

    // ======================================
    // Status Filter
    // ======================================

    if (status) {
      filter.status = status;
    }

    // ======================================
    // Date Filter
    // ======================================

    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte =
          new Date(startDate);
      }

      if (endDate) {
        const endDateValue =
          new Date(endDate);

        endDateValue.setHours(
          23,
          59,
          59,
          999
        );

        filter.createdAt.$lte =
          endDateValue;
      }
    }

    // ======================================
    // Get Transactions
    // ======================================

    const transactions =
      await Transaction.find(filter)
        .populate(
          "paymentId"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get All Transactions
// PLATFORM ADMIN
// ==========================================

export const getAllTransactions = async (
  req,
  res,
  next
) => {
  try {
    const {
      organizationId,
      status,
      startDate,
      endDate,
    } = req.query;

    const filter = {};

    // ======================================
    // Organization Filter
    // ======================================

    if (organizationId) {
      filter.organizationId =
        organizationId;
    }

    // ======================================
    // Status Filter
    // ======================================

    if (status) {
      filter.status = status;
    }

    // ======================================
    // Date Filter
    // ======================================

    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte =
          new Date(startDate);
      }

      if (endDate) {
        const endDateValue =
          new Date(endDate);

        endDateValue.setHours(
          23,
          59,
          59,
          999
        );

        filter.createdAt.$lte =
          endDateValue;
      }
    }

    // ======================================
    // Get Transactions
    // ======================================

    const transactions =
      await Transaction.find(filter)
        .populate(
          "organizationId",
          "name contactEmail billingEmail"
        )
        .populate(
          "paymentId"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get Total Revenue
// PLATFORM ADMIN
// ==========================================

export const getTotalRevenue = async (
  req,
  res,
  next
) => {
  try {
    const {
      organizationId,
      startDate,
      endDate,
    } = req.query;

    // ======================================
    // Revenue Filter
    // ======================================

    const filter = {
      status: "SUCCESS",

      type: {
        $in: [
          "SUBSCRIPTION_PAYMENT",
          "UPGRADE",
        ],
      },
    };

    // ======================================
    // Organization Filter
    // ======================================

    if (organizationId) {
      filter.organizationId =
        organizationId;
    }

    // ======================================
    // Date Filter
    // ======================================

    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte =
          new Date(startDate);
      }

      if (endDate) {
        const endDateValue =
          new Date(endDate);

        endDateValue.setHours(
          23,
          59,
          59,
          999
        );

        filter.createdAt.$lte =
          endDateValue;
      }
    }

    // ======================================
    // Calculate Revenue
    // ======================================

    const result =
      await Transaction.aggregate([
        {
          $match: filter,
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

    const totalRevenue =
      result[0]?.totalRevenue || 0;

    return res.status(200).json({
      success: true,
      totalRevenue,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get Revenue Statistics
// PLATFORM ADMIN
// ==========================================

export const getRevenueStats = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await Transaction.aggregate([
        {
          $match: {
            status: "SUCCESS",
          },
        },

        {
          $group: {
            _id: "$type",

            total: {
              $sum: "$amount",
            },

            count: {
              $sum: 1,
            },
          },
        },
      ]);

    return res.status(200).json({
      success: true,
      stats: result,
    });
  } catch (error) {
    next(error);
  }
};