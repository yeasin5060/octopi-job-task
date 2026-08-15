import express from "express";

import {
  getOrganization,
  updateOrganization,
  getOrganizationSubscription,
} from "../controllers/organization.controller.js";


import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorize(
    "ORG_ADMIN",
    "MEMBER"
  ),
  getOrganization
);

router.patch(
  "/",
  protect,
  authorize("ORG_ADMIN"),
  updateOrganization
);

router.get(
  "/subscription",
  protect,
  authorize("ORG_ADMIN"),
  getOrganizationSubscription
);

export default router;