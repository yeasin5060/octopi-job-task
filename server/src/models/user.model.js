import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["PLATFORM_ADMIN", "ORG_ADMIN", "MEMBER"],
      default: "MEMBER",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INVITED", "SUSPENDED"],
      default: "ACTIVE",
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ organizationId: 1, role: 1 });

export const User = mongoose.model("User", userSchema);