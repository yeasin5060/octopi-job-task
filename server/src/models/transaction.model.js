import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    // ==========================================
    // Organization
    // ==========================================

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    // ==========================================
    // Payment
    // ==========================================

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },

    // ==========================================
    // Amount
    // ==========================================

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // ==========================================
    // Transaction Type
    // ==========================================

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

    // ==========================================
    // Transaction Status
    // ==========================================

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

    // ==========================================
    // Description
    // ==========================================

    description: {
      type: String,
      default: "",
      trim: true,
    },
  },

  {
    timestamps: true,
  }
);

// ==========================================
// Index
// ==========================================

transactionSchema.index({
  organizationId: 1,
  status: 1,
  createdAt: -1,
});

// ==========================================
// Model
// ==========================================

export const Transaction =
  mongoose.model(
    "Transaction",
    transactionSchema
  );