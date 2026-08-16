import express from "express";

import {
  createPlatformAdmin,
  getDashboardStats,
  updateOrganizationStatus,
} from "../controllers/admin.controller.js";

import {
  getAllTransactions,
} from "../controllers/transaction.controller.js";

import { authorize, requirePlatformAdmin } from "../middlewares/role.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post(
  "/create",
  protect,
  requirePlatformAdmin,
  createPlatformAdmin
);

router.get(
  "/stats",
  protect,
  requirePlatformAdmin,
  getDashboardStats
);

router.patch(
  "/organizations/:id/status",
  updateOrganizationStatus
);

router.get(
  "/transactions",
  getAllTransactions
);

export default router;