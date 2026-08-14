import mongoose from "mongoose";

const stripeEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    type: {
      type: String,
      required: true,
    },

    processed: {
      type: Boolean,
      default: false,
    },

    processedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const StripeEvent = mongoose.model("StripeEvent",stripeEventSchema);