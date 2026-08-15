import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './src/db/db.js';
import authRoutes from "./src/routes/auth.routes.js";
import organizationRoutes from "./src//routes/organization.routes.js";
import memberRoutes from "./src/routes/member.routes.js";
import planRoutes from "./src/routes/plan.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import transactionRoutes from "./src/routes/transaction.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import webhookRoutes from "./src/routes/webhook.routes.js";



const app = express();

//Database connection
await connectDB()

app.use(cors({
    origin : "*",
    methods : ["GET" , "POST", "DELETE" , "PUT"],
    allowedHeaders : ["Content-Type", "Authorization"]
}));



app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {res.send("Server is live!");});

// Stripe webhook MUST come before express.json()
app.use(
  "/api/webhooks/stripe",
  express.raw({
    type: "application/json",
  }),
  webhookRoutes
);

app.use("/api/auth", authRoutes);

app.use(
  "/api/organization",
  organizationRoutes
);

app.use(
  "/api/members",
  memberRoutes
);

app.use("/api/plans", planRoutes);

app.use("/api/payments", paymentRoutes);

app.use(
  "/api/transactions",
  transactionRoutes
);

app.use("/api/admin", adminRoutes);



const PORT = process.env.PORT || 5000 ;

app.listen(PORT , ()=> console.log(`Server running on port ${PORT}`))