import mongoose from "mongoose";

const pendingRegistrationSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
      trim: true,
    },

    adminName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },

    stripeCheckoutSessionId: {
      type: String,
      unique: true,
      sparse: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index
pendingRegistrationSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
  }
);

export const PendingRegistration =
  mongoose.model(
    "PendingRegistration",
    pendingRegistrationSchema
  );