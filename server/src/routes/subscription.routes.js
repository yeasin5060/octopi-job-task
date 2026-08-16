import express from "express";

import {
  getCurrentSubscription,
  changeSubscription,
  cancelSubscription,
} from "../controllers/subscription.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();


// Current subscription
router.get(
  "/current",
  protect,
  authorize("ORG_ADMIN", "MEMBER"),
  getCurrentSubscription
);


// Change subscription
router.patch(
  "/change",
  protect,
  authorize("ORG_ADMIN"),
  changeSubscription
);


// Cancel subscription
router.post(
  "/cancel",
  protect,
  authorize("ORG_ADMIN"),
  cancelSubscription
);

export default router;