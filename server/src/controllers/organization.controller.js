import { Organization } from "../models/organization.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Plan } from "../models/plan.model.js";

// ==========================================
// Get Organization
// ==========================================

export const getOrganization = async (req, res, next) => {
  try {
    const organization = await Organization.findById(
      req.user.organizationId
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    return res.json({
      success: true,
      organization,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get All Organizations
// PLATFORM ADMIN
// ==========================================

export const getAllOrganizations = async (
  req,
  res,
  next
) => {
  try {
    const organizations =
      await Organization.find()
        .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: organizations.length,
      organizations,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Create Organization
// ==========================================

export const createOrganization = async (req, res, next) => {
  try {
    const {
      name,
      contactEmail,
      billingEmail,
    } = req.body;

    // Validate
    if (!name || !contactEmail || !billingEmail) {
      return res.status(400).json({
        success: false,
        message:
          "Organization name, contact email and buillingEmail required",
      });
    }

    // Check existing organization for current user
    if (req.user.organizationId) {
      return res.status(409).json({
        success: false,
        message: "User already belongs to an organization",
      });
    }


    // Create organization
    const organization = await Organization.create({
      name: name.trim(),
      contactEmail: contactEmail.toLowerCase().trim(),
      billingEmail:
        billingEmail?.toLowerCase().trim() ||
        contactEmail.toLowerCase().trim(),

      status: "ACTIVE",
    });

    return res.status(201).json({
      success: true,
      message: "Organization created successfully",
      organization,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Update Organization
// ==========================================

export const updateOrganization = async (req, res, next) => {
  try {
    const {
      name,
      contactEmail,
      billingEmail,
    } = req.body;

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

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    return res.json({
      success: true,
      organization,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get Organization Subscription
// ==========================================

export const getOrganizationSubscription = async (
  req,
  res,
  next
) => {
  try {
    const subscription =
      await Subscription.findOne({
        organizationId:
          req.user.organizationId,
      }).populate("planId");

    return res.json({
      success: true,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};