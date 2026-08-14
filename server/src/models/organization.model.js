import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    billingEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "ACTIVE",
        "SUSPENDED",
        "CANCELLED",
      ],
      default: "PENDING",
      index: true,
    },

    stripeCustomerId: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Organization = mongoose.model("Organization",organizationSchema);