import express from "express";

import {
  getPlans,
  createPlan,
  updatePlan,
  disablePlan,
} from "../controllers/plan.controller.js";



import { authorize } from "../middlewares/role.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getPlans);

router.post(
  "/",
  protect,
  authorize("PLATFORM_ADMIN"),
  createPlan
);

router.patch(
  "/:id",
  protect,
  authorize("PLATFORM_ADMIN"),
  updatePlan
);

router.patch(
  "/:id/disable",
  protect,
  authorize("PLATFORM_ADMIN"),
  disablePlan
);

export default router;