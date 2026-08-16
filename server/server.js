import express from "express";
import "dotenv/config";
import cors from "cors";

import connectDB from "./src/db/db.js";

import authRoutes from "./src/routes/auth.routes.js";
import organizationRoutes from "./src/routes/organization.routes.js";
import memberRoutes from "./src/routes/member.routes.js";
import planRoutes from "./src/routes/plan.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import transactionRoutes from "./src/routes/transaction.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import subscriptionRoutes from "./src/routes/subscription.routes.js";
import webhookRoutes from "./src/routes/webhook.routes.js";

const app = express();

// ==========================================
// Database
// ==========================================

await connectDB();

// ==========================================
// CORS
// ==========================================

app.use(
  cors({
    origin: "*",
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ==========================================
// Stripe Webhook
// IMPORTANT:
// MUST be before express.json()
// ==========================================

app.use(
  "/api/webhooks/stripe",
  express.raw({
    type: "application/json",
  }),
  webhookRoutes
);

// ==========================================
// Body Parser
// ==========================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ==========================================
// Health Check
// ==========================================

app.get("/", (req, res) => {
  res.send("Server is live!");
});

// ==========================================
// Routes
// ==========================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/organization",
  organizationRoutes
);

app.use(
  "/api/members",
  memberRoutes
);

app.use(
  "/api/plans",
  planRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);

app.use(
  "/api/transactions",
  transactionRoutes
);

app.use(
  "/api/subscriptions",
  subscriptionRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

// ==========================================
// Error Handler
// ==========================================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      err.message || "Internal Server Error",
  });
});

// ==========================================
// Server
// ==========================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});