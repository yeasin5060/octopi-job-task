import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    type: {
      type: String,
      enum: [
        "SUBSCRIPTION_PAYMENT",
        "UPGRADE",
        "DOWNGRADE",
        "REFUND",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "SUCCESS",
        "FAILED",
        "REFUNDED",
        "ROLLED_BACK",
      ],
      default: "PENDING",
      index: true,
    },

    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.index({
  organizationId: 1,
  status: 1,
  createdAt: -1,
});

export const Transaction = mongoose.model("Transaction",transactionSchema);