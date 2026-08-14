import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },

    stripeSubscriptionId: {
      type: String,
      unique: true,
      sparse: true,
    },

    status: {
      type: String,
      enum: [
        "ACTIVE",
        "PENDING",
        "FAILED",
        "CANCELLED",
        "EXPIRED",
      ],
      default: "PENDING",
      index: true,
    },

    currentPeriodStart: Date,

    currentPeriodEnd: Date,

    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

subscriptionSchema.index({
  organizationId: 1,
  status: 1,
});

export const Subscription = mongoose.model("Subscription",subscriptionSchema);