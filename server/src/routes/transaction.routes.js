import express from "express";

import {
  getMyTransactions,
  getAllTransactions,
  getTotalRevenue,
  getRevenueStats,
} from "../controllers/transaction.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

// ==========================================
// My Organization Transactions
// ORG ADMIN / MEMBER
// ==========================================

router.get(
  "/my",
  protect,
  authorize(
    "ORG_ADMIN",
    "MEMBER"
  ),
  getMyTransactions
);

// ==========================================
// All Transactions
// PLATFORM ADMIN
// ==========================================

router.get(
  "/",
  protect,
  authorize(
    "PLATFORM_ADMIN"
  ),
  getAllTransactions
);

// ==========================================
// Total Revenue
// PLATFORM ADMIN
// ==========================================

router.get(
  "/revenue",
  protect,
  authorize(
    "PLATFORM_ADMIN"
  ),
  getTotalRevenue
);

// ==========================================
// Revenue Statistics
// PLATFORM ADMIN
// ==========================================

router.get(
  "/revenue/stats",
  protect,
  authorize(
    "PLATFORM_ADMIN"
  ),
  getRevenueStats
);

export default router;