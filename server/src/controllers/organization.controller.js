import { Organization } from "../models/organization.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Plan } from "../models/plan.model.js";


export const getOrganization = async (req,res,next) => {
  try {
    const organization =
      await Organization.findById(
        req.user.organizationId
      );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    res.json({
      success: true,
      organization,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrganization = async (req,res,next) => {
  try {
    const {name, contactEmail, billingEmail} = req.body;

    const organization =
      await Organization.findByIdAndUpdate(
        req.user.organizationId,
        {
          name,
          contactEmail,
          billingEmail,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    res.json({
      success: true,
      organization,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationSubscription = async (req, res, next) => {
    try {
      const subscription =
        await Subscription.findOne({
          organizationId:
            req.user.organizationId,
        }).populate("planId");

      res.json({
        success: true,
        subscription,
      });
    } catch (error) {
      next(error);
    }
  };