import Stripe from "stripe";
import mongoose from "mongoose";


import {User} from "../models/user.model.js";
import {Subscription} from "../models/subscription.model.js";
import {Payment} from "../models/payment.model.js";
import {Transaction} from "../models/transaction.model.js";
import { StripeEvent } from "../models/stripeEvent.model.js";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);

export const handleStripeWebhook =
  async (req, res) => {
    let event;

    try {
      const signature =
        req.headers["stripe-signature"];

      event =
        stripe.webhooks.constructEvent(
          req.body,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid Stripe webhook",
      });
    }

    try {
      const existingEvent =
        await StripeEvent.findOne({
          eventId: event.id,
        });

      if (existingEvent) {
        return res.status(200).json({
          received: true,
          duplicate: true,
        });
      }

      await StripeEvent.create({
        eventId: event.id,
        type: event.type,
        processed: false,
      });

      if (
        event.type ===
        "checkout.session.completed"
      ) {
        const session = event.data.object;

        await processSuccessfulCheckout(
          session
        );
      }

      await StripeEvent.findOneAndUpdate(
        {
          eventId: event.id,
        },
        {
          processed: true,
          processedAt: new Date(),
        }
      );

      return res.status(200).json({
        received: true,
      });
    } catch (error) {
      console.error(
        "Webhook processing error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Webhook processing failed",
      });
    }
  };