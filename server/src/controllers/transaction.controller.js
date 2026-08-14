import { Transaction } from "../models/transaction.model.js";


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

    const filter = {
      organizationId:
        req.user.organizationId,
    };

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte =
          new Date(startDate);
      }

      if (endDate) {
        filter.createdAt.$lte =
          new Date(endDate);
      }
    }

    const transactions =
      await Transaction.find(filter)
        .populate("paymentId")
        .sort({ createdAt: -1 });

    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

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

    if (organizationId) {
      filter.organizationId =
        organizationId;
    }

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte =
          new Date(startDate);
      }

      if (endDate) {
        filter.createdAt.$lte =
          new Date(endDate);
      }
    }

    const transactions =
      await Transaction.find(filter)
        .populate("organizationId", "name")
        .populate("paymentId")
        .sort({ createdAt: -1 });

    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};