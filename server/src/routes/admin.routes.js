import express from "express";

import {
  getStats,
  updateOrganizationStatus,
} from "../controllers/admin.controller.js";

import {
  getAllTransactions,
} from "../controllers/transaction.controller.js";

import { authorize } from "../middlewares/role.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(
  protect,
  authorize("PLATFORM_ADMIN")
);

router.get("/stats", getStats);

router.patch(
  "/organizations/:id/status",
  updateOrganizationStatus
);

router.get(
  "/transactions",
  getAllTransactions
);

export default router;