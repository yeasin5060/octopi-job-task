import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Organization } from "../models/organization.model.js";

export const protect = async (req, res, next) => {
  try {
    // 1. Check Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // 3. Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // 4. Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // 5. Check user status
    if (user.status === "SUSPENDED") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended",
      });
    }

    // 6. Check organization status
    // Platform admin doesn't belong to an organization
    if (
      user.role !== "PLATFORM_ADMIN" &&
      user.organizationId
    ) {
      const organization =
        await Organization.findById(
          user.organizationId
        ).select("status name");

      if (!organization) {
        return res.status(403).json({
          success: false,
          message: "Organization not found",
        });
      }

      if (
        organization.status === "SUSPENDED"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Your organization has been suspended",
        });
      }

      if (
        organization.status === "CANCELLED"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Your organization has been cancelled",
        });
      }

      if (
        organization.status === "PENDING"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Your organization is not active yet",
        });
      }
    }

    // 7. Attach user to request
    req.user = user;

    // Optional: attach organization
    if (
      user.organizationId &&
      user.role !== "PLATFORM_ADMIN"
    ) {
      req.organization =
        await Organization.findById(
          user.organizationId
        ).select("name status");
    }

    // 8. Continue
    next();

  } catch (error) {
    // JWT expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    // Invalid JWT
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    // Other errors
    console.error("Auth middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};