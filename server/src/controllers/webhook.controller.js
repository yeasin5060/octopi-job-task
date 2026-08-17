import Stripe from "stripe";

import { StripeEvent } from "../models/stripeEvent.model.js";
import { PendingRegistration } from "../models/pendingRegistration.model.js";
import { User } from "../models/user.model.js";
import { Plan } from "../models/plan.model.js";
import { Organization } from "../models/organization.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Payment } from "../models/payment.model.js";
import { Transaction } from "../models/transaction.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ======================================================
// Stripe Webhook
// ======================================================

export const handleStripeWebhook = async (req, res) => {
  let event;

  console.log("\n==========================================");
  console.log("🔥 STRIPE WEBHOOK REQUEST RECEIVED");
  console.log("==========================================");

  // ====================================================
  // Verify Stripe Signature
  // ====================================================

  try {
    const signature = req.headers["stripe-signature"];

    if (!signature) {
      console.error("❌ Stripe signature missing");

      return res.status(400).json({
        success: false,
        message: "Stripe signature missing",
      });
    }

    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("✅ Stripe signature verified");
    console.log("Event Type:", event.type);
    console.log("Event ID:", event.id);
  } catch (error) {
    console.error("❌ Stripe signature verification failed");
    console.error(error.message);

    return res.status(400).json({
      success: false,
      message: "Invalid Stripe webhook",
    });
  }

  // ====================================================
  // Event Processing
  // ====================================================

  try {
    let stripeEvent = await StripeEvent.findOne({
      eventId: event.id,
    });

    // --------------------------------------------------
    // Already processed
    // --------------------------------------------------

    if (stripeEvent?.processed === true) {
      console.log("⚠️ Event already processed:", event.id);

      return res.status(200).json({
        received: true,
        duplicate: true,
      });
    }

    // --------------------------------------------------
    // Create event record
    // --------------------------------------------------

    if (!stripeEvent) {
      stripeEvent = await StripeEvent.create({
        eventId: event.id,
        type: event.type,
        processed: false,
      });

      console.log("📝 Stripe event created:", event.id);
    } else {
      console.log("🔄 Retrying failed event:", event.id);
    }

    // ==================================================
    // EVENT HANDLERS
    // ==================================================

    switch (event.type) {
      // -----------------------------------------------
      // First subscription checkout
      // -----------------------------------------------

      case "checkout.session.completed":
        console.log("🛒 Checkout completed");

        await processCheckoutCompleted(
          event.data.object
        );

        break;

      // -----------------------------------------------
      // Recurring subscription payment
      // -----------------------------------------------

      case "invoice.payment_succeeded":
        console.log("💰 Invoice payment succeeded");

        await processInvoicePayment(
          event.data.object
        );

        break;

      // -----------------------------------------------
      // Stripe newer payment event
      // -----------------------------------------------

      case "invoice_payment.paid":
        console.log("💰 Invoice payment paid");

        await processInvoicePayment(
          event.data.object
        );

        break;

      // -----------------------------------------------
      // Other events
      // -----------------------------------------------

      default:
        console.log(
          `ℹ️ Event ignored: ${event.type}`
        );
    }

    // ==================================================
    // Mark processed
    // ==================================================

    await StripeEvent.findOneAndUpdate(
      {
        eventId: event.id,
      },
      {
        processed: true,
        processedAt: new Date(),
      }
    );

    console.log(
      "✅ Stripe event processed:",
      event.id
    );

    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error("\n==========================================");
    console.error("❌ WEBHOOK PROCESSING ERROR");
    console.error("==========================================");

    console.error("Event Type:", event?.type);
    console.error("Event ID:", event?.id);
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);

    if (error.code) {
      console.error("Mongo Error Code:", error.code);
    }

    console.error("Stack:", error.stack);

    console.error("==========================================");

    // processed false থাকবে
    // Stripe retry করবে

    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// ======================================================
// Checkout Completed
// ======================================================

const processCheckoutCompleted = async (session) => {
  console.log("\n==========================================");
  console.log("🛒 PROCESS CHECKOUT COMPLETED");
  console.log("==========================================");

  console.log("Session ID:", session.id);
  console.log("Payment Status:", session.payment_status);
  console.log("Customer:", session.customer);
  console.log("Subscription:", session.subscription);
  console.log("Amount:", session.amount_total);
  console.log("Currency:", session.currency);
  console.log("Metadata:", session.metadata);

  // ====================================================
  // Validate payment
  // ====================================================

  if (session.payment_status !== "paid") {
    throw new Error(
      `Checkout payment is not completed: ${session.payment_status}`
    );
  }

  // ====================================================
  // Check duplicate payment
  // ====================================================

  const existingPayment =
    await Payment.findOne({
      stripeCheckoutSessionId: session.id,
    });

  if (existingPayment) {
    console.log(
      "⚠️ Payment already exists:",
      existingPayment._id
    );

    return;
  }

  // ====================================================
  // Metadata
  // ====================================================

  const {
    pendingRegistrationId,
    planId,
  } = session.metadata || {};

  // ====================================================
  // EXISTING CUSTOMER / USER
  // ====================================================

  /*
    যদি user already থাকে তাহলে নতুন Organization/User
    তৈরি করবো না।

    Existing organization খুঁজে payment create করবো।
  */

  if (!pendingRegistrationId) {
    console.log(
      "ℹ️ No pending registration."
    );

    await createPaymentForExistingSubscription(
      session
    );

    return;
  }

  // ====================================================
  // Validate plan
  // ====================================================

  if (!planId) {
    throw new Error(
      "Missing planId in Stripe metadata"
    );
  }

  // ====================================================
  // Find pending registration
  // ====================================================

  const pendingRegistration =
    await PendingRegistration.findById(
      pendingRegistrationId
    ).select("+password");

  if (!pendingRegistration) {
    throw new Error(
      `PendingRegistration not found: ${pendingRegistrationId}`
    );
  }

  // ====================================================
  // Check existing user
  // ====================================================

  const existingUser = await User.findOne({
    email: pendingRegistration.email,
  });

  // ====================================================
  // Existing user
  // ====================================================

  if (existingUser) {
    console.log(
      "⚠️ Existing user found:",
      existingUser.email
    );

    /*
      এখানে return না করে payment create করতে হবে।
    */

    await createPaymentForExistingSubscription(
      session
    );

    return;
  }

  // ====================================================
  // Find plan
  // ====================================================

  const plan = await Plan.findOne({
    _id: planId,
    isActive: true,
  });

  if (!plan) {
    throw new Error(
      `Plan not found: ${planId}`
    );
  }

  // ====================================================
  // Create Organization
  // ====================================================

  const organization =
    await Organization.create({
      name:
        pendingRegistration.organizationName,

      contactEmail:
        pendingRegistration.email,

      billingEmail:
        pendingRegistration.email,

      status: "ACTIVE",

      stripeCustomerId:
        session.customer || null,
    });

  console.log(
    "✅ Organization created:",
    organization._id
  );

  // ====================================================
  // Create User
  // ====================================================

  const user = await User.create({
    name:
      pendingRegistration.adminName,

    email:
      pendingRegistration.email,

    password:
      pendingRegistration.password,

    role: "ORG_ADMIN",

    status: "ACTIVE",

    organizationId:
      organization._id,
  });

  console.log(
    "✅ User created:",
    user._id
  );

  // ====================================================
  // Create Subscription
  // ====================================================

  const subscription =
    await Subscription.create({
      organizationId:
        organization._id,

      planId:
        plan._id,

      stripeSubscriptionId:
        session.subscription || null,

      status: "ACTIVE",
    });

  console.log(
    "✅ Subscription created:",
    subscription._id
  );

  // ====================================================
  // Create Payment
  // ====================================================

  const payment =
    await createPayment({
      organizationId:
        organization._id,

      subscriptionId:
        subscription._id,

      session,

      amount:
        (session.amount_total || 0) / 100,
    });

  // ====================================================
  // Create Transaction
  // ====================================================

  const transaction =
    await createTransaction({
      organizationId:
        organization._id,

      payment,

      planName:
        plan.name,
    });

  // ====================================================
  // Delete pending registration
  // ====================================================

  await PendingRegistration.findByIdAndDelete(
    pendingRegistration._id
  );

  console.log(
    "🗑️ PendingRegistration deleted"
  );

  console.log("\n==========================================");
  console.log(
    "🎉 INITIAL REGISTRATION COMPLETED"
  );
  console.log("==========================================");

  console.log({
    organizationId:
      organization._id,

    userId:
      user._id,

    subscriptionId:
      subscription._id,

    paymentId:
      payment._id,

    transactionId:
      transaction._id,
  });
};

// ======================================================
// Existing Subscription Payment
// ======================================================

const createPaymentForExistingSubscription =
  async (session) => {
    console.log(
      "💰 Processing existing subscription payment..."
    );

    // ==================================================
    // Find subscription
    // ==================================================

    let subscription = null;

    if (session.subscription) {
      subscription =
        await Subscription.findOne({
          stripeSubscriptionId:
            session.subscription,
        });
    }

    // ==================================================
    // Find organization from customer
    // ==================================================

    let organization = null;

    if (session.customer) {
      organization =
        await Organization.findOne({
          stripeCustomerId:
            session.customer,
        });
    }

    // ==================================================
    // If subscription not found
    // ==================================================

    if (!subscription) {
      console.error(
        "❌ Subscription not found:",
        session.subscription
      );

      throw new Error(
        `Subscription not found: ${session.subscription}`
      );
    }

    // ==================================================
    // If organization not found
    // ==================================================

    if (!organization) {
      organization =
        await Organization.findById(
          subscription.organizationId
        );
    }

    if (!organization) {
      throw new Error(
        `Organization not found for subscription: ${subscription._id}`
      );
    }

    // ==================================================
    // Check duplicate Payment
    // ==================================================

    const existingPayment =
      await Payment.findOne({
        $or: [
          {
            stripeCheckoutSessionId:
              session.id,
          },

          ...(session.payment_intent
            ? [
                {
                  stripePaymentIntentId:
                    session.payment_intent,
                },
              ]
            : []),
        ],
      });

    if (existingPayment) {
      console.log(
        "⚠️ Payment already exists:",
        existingPayment._id
      );

      return existingPayment;
    }

    // ==================================================
    // Create Payment
    // ==================================================

    const payment =
      await createPayment({
        organizationId:
          organization._id,

        subscriptionId:
          subscription._id,

        session,

        amount:
          (session.amount_total || 0) / 100,
      });

    // ==================================================
    // Find Plan
    // ==================================================

    const plan =
      await Plan.findById(
        subscription.planId
      );

    // ==================================================
    // Create Transaction
    // ==================================================

    await createTransaction({
      organizationId:
        organization._id,

      payment,

      planName:
        plan?.name || "Subscription",
    });

    console.log(
      "🎉 Existing subscription payment completed"
    );

    return payment;
  };

// ======================================================
// Invoice Payment
// ======================================================

const processInvoicePayment = async (invoice) => {
  console.log("\n==========================================");
  console.log("💰 PROCESS INVOICE PAYMENT");
  console.log("==========================================");

  console.log("Invoice ID:", invoice.id);
  console.log(
    "Subscription:",
    invoice.subscription
  );
  console.log(
    "Customer:",
    invoice.customer
  );
  console.log(
    "Amount Paid:",
    invoice.amount_paid
  );
  console.log(
    "Currency:",
    invoice.currency
  );

  // ====================================================
  // Find subscription
  // ====================================================

  if (!invoice.subscription) {
    console.log(
      "ℹ️ Invoice has no subscription. Ignoring."
    );

    return;
  }

  const subscription =
    await Subscription.findOne({
      stripeSubscriptionId:
        invoice.subscription,
    });

  if (!subscription) {
    throw new Error(
      `Subscription not found: ${invoice.subscription}`
    );
  }

  // ====================================================
  // Find organization
  // ====================================================

  const organization =
    await Organization.findById(
      subscription.organizationId
    );

  if (!organization) {
    throw new Error(
      `Organization not found: ${subscription.organizationId}`
    );
  }

  // ====================================================
  // Check duplicate using invoice metadata
  // ====================================================

  /*
    Payment schema-তে invoiceId থাকলে সবচেয়ে ভালো।
    বর্তমানে না থাকায় invoice number/id দিয়ে metadata
    রাখা যাচ্ছে না।

    তাই paymentIntent ব্যবহার করা হচ্ছে।
  */

  let paymentIntentId =
    invoice.payment_intent || null;

  // ====================================================
  // Duplicate check
  // ====================================================

  if (paymentIntentId) {
    const existingPayment =
      await Payment.findOne({
        stripePaymentIntentId:
          paymentIntentId,
      });

    if (existingPayment) {
      console.log(
        "⚠️ Invoice payment already exists:",
        existingPayment._id
      );

      return;
    }
  }

  // ====================================================
  // Create Payment
  // ====================================================

  const payment =
    await Payment.create({
      organizationId:
        organization._id,

      subscriptionId:
        subscription._id,

      amount:
        (invoice.amount_paid || 0) / 100,

      currency:
        invoice.currency || "usd",

      status:
        "SUCCESS",

      stripePaymentIntentId:
        paymentIntentId,

      paidAt:
        new Date(),
    });

  console.log(
    "✅ Renewal Payment created:",
    payment._id
  );

  // ====================================================
  // Find Plan
  // ====================================================

  const plan =
    await Plan.findById(
      subscription.planId
    );

  // ====================================================
  // Create Transaction
  // ====================================================

  const transaction =
    await createTransaction({
      organizationId:
        organization._id,

      payment,

      planName:
        plan?.name || "Subscription",
    });

  console.log(
    "✅ Renewal Transaction created:",
    transaction._id
  );
};

// ======================================================
// Create Payment Helper
// ======================================================

const createPayment = async ({
  organizationId,
  subscriptionId,
  session,
  amount,
}) => {
  // ====================================================
  // Duplicate checkout session
  // ====================================================

  const existingPayment =
    await Payment.findOne({
      stripeCheckoutSessionId:
        session.id,
    });

  if (existingPayment) {
    console.log(
      "⚠️ Payment already exists:",
      existingPayment._id
    );

    return existingPayment;
  }

  // ====================================================
  // Duplicate payment intent
  // ====================================================

  if (session.payment_intent) {
    const existingIntent =
      await Payment.findOne({
        stripePaymentIntentId:
          session.payment_intent,
      });

    if (existingIntent) {
      console.log(
        "⚠️ PaymentIntent already exists:",
        existingIntent._id
      );

      return existingIntent;
    }
  }

  // ====================================================
  // Create Payment
  // ====================================================

  const payment =
    await Payment.create({
      organizationId,

      subscriptionId,

      amount,

      currency:
        session.currency || "usd",

      status: "SUCCESS",

      stripePaymentIntentId:
        session.payment_intent || null,

      stripeCheckoutSessionId:
        session.id,

      paidAt: new Date(),
    });

  console.log(
    "✅ Payment created:",
    payment._id
  );

  return payment;
};

// ======================================================
// Create Transaction Helper
// ======================================================

const createTransaction = async ({
  organizationId,
  payment,
  planName,
}) => {
  // ====================================================
  // Check existing transaction
  // ====================================================

  const existingTransaction =
    await Transaction.findOne({
      paymentId:
        payment._id,
    });

  if (existingTransaction) {
    console.log(
      "⚠️ Transaction already exists:",
      existingTransaction._id
    );

    return existingTransaction;
  }

  // ====================================================
  // Create Transaction
  // ====================================================

  const transaction =
    await Transaction.create({
      organizationId,

      paymentId:
        payment._id,

      amount:
        payment.amount,

      type:
        "SUBSCRIPTION_PAYMENT",

      status:
        "SUCCESS",

      description:
        `Subscription payment for ${planName}`,
    });

  console.log(
    "✅ Transaction created:",
    transaction._id
  );

  return transaction;
};