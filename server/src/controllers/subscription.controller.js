import { Subscription } from "../models/subscription.model.js";
import { Plan } from "../models/plan.model.js";
import { Organization } from "../models/organization.model.js";

// ==========================================
// Get Current Subscription
// ==========================================

export const getCurrentSubscription = async ( req, res, next) => {
  try {
    const organizationId =
      req.user.organizationId;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message:
          "User does not belong to an organization",
      });
    }

    const subscription =
      await Subscription.findOne({
        organizationId,
      }).populate("planId");

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    return res.status(200).json({
      success: true,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};


// ==========================================
// Change Subscription
// ==========================================

export const changeSubscription = async ( req, res, next) => {
  try {
    const { planId } = req.body;

    const organizationId =
      req.user.organizationId;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message:
          "User does not belong to an organization",
      });
    }

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: "Plan ID is required",
      });
    }

    // Check new plan
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

    // Find current subscription
    const subscription =
      await Subscription.findOne({
        organizationId,
      });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    // Check same plan
    if (
      subscription.planId.toString() ===
      planId.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You are already subscribed to this plan",
      });
    }

    // Change plan
    subscription.planId = plan._id;
    subscription.status = "ACTIVE";

    await subscription.save();

    const updatedSubscription =
      await Subscription.findById(
        subscription._id
      ).populate("planId");

    return res.status(200).json({
      success: true,
      message:
        "Subscription changed successfully",
      subscription: updatedSubscription,
    });
  } catch (error) {
    next(error);
  }
};


// ==========================================
// Cancel Subscription
// ==========================================

export const cancelSubscription = async (
  req,
  res,
  next
) => {
  try {
    const organizationId =
      req.user.organizationId;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message:
          "User does not belong to an organization",
      });
    }

    const subscription =
      await Subscription.findOne({
        organizationId,
      });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    if (
      subscription.status === "CANCELLED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Subscription is already cancelled",
      });
    }

    subscription.status = "CANCELLED";

    await subscription.save();

    return res.status(200).json({
      success: true,
      message:
        "Subscription cancelled successfully",
      subscription,
    });
  } catch (error) {
    next(error);
  }
};