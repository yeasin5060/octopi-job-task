import { User } from "../models/user.model.js";


export const getMembers = async ( req, res, next) => {
  try {
    const members = await User.find({
      organizationId: req.user.organizationId,
    }).select("-password");

    res.json({
      success: true,
      members,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMemberRole = async ( req, res, next) => {
  try {
    const { role } = req.body;

    if (!["ORG_ADMIN", "MEMBER"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const member = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        organizationId: req.user.organizationId,
      },
      {
        role,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.json({
      success: true,
      member,
    });
  } catch (error) {
    next(error);
  }
};

export const removeMember = async ( req, res, next) => {
  try {
    const member = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        organizationId: req.user.organizationId,
      },
      {
        status: "SUSPENDED",
      },
      {
        new: true,
      }
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.json({
      success: true,
      message: "Member removed",
    });
  } catch (error) {
    next(error);
  }
};