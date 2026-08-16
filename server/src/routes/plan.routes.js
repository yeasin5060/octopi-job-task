import express from "express";

import {
  createPlan,
  disablePlan,
  getPlans,
  updatePlan,
} from "../controllers/plan.controller.js";



import { requirePlatformAdmin } from "../middlewares/role.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getPlans);

router.post(
  "/",
  protect,
  requirePlatformAdmin,
  createPlan
);

router.patch(
  "/:id",
  protect,
  requirePlatformAdmin,
  updatePlan
);

router.patch(
  "/:id/disable",
  protect,
  requirePlatformAdmin,
  disablePlan
);

export default router;