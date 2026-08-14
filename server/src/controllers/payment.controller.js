import Stripe from "stripe";
import { Plan } from "../models/plan.model.js";


const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);

export const createCheckoutSession =
  async (req, res, next) => {
    try {
      const { planId } = req.body;

      const plan = await Plan.findOne({
        _id: planId,
        isActive: true,
      });

      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Plan not found",
        });
      }

      const session =
        await stripe.checkout.sessions.create({
          mode: "subscription",

          payment_method_types: ["card"],

          customer_email: req.user.email,

          line_items: [
            {
              price_data: {
                currency: plan.currency,

                product_data: {
                  name: plan.name,
                },

                recurring: {
                  interval:
                    plan.billingInterval ===
                    "YEARLY"
                      ? "year"
                      : "month",
                },

                unit_amount:
                  plan.price * 100,
              },

              quantity: 1,
            },
          ],

          metadata: {
            planId: plan._id.toString(),
            userId: req.user._id.toString(),
            organizationId:
              req.user.organizationId?.toString() ||
              "",
          },

          success_url:
            `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

          cancel_url:
            `${process.env.CLIENT_URL}/payment/failed`,
        });

      res.json({
        success: true,
        url: session.url,
      });
    } catch (error) {
      next(error);
    }
  };