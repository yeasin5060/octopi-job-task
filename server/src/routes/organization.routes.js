import express from "express";

import {
  getOrganization,
  updateOrganization,
  getOrganizationSubscription,
  createOrganization,
  getAllOrganizations,
} from "../controllers/organization.controller.js";


import { protect } from "../middlewares/auth.middleware.js";
import { authorize, requireOrgAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();


router.get(
  "/me",
  protect,
  authorize("ORG_ADMIN", "MEMBER"),
  getOrganization
);


router.get(
  "/",
  protect,
  getAllOrganizations
);


router.patch(
  "/",
  protect,
  requireOrgAdmin,
  updateOrganization
);

router.get(
  "/subscription",
  protect,
  requireOrgAdmin,
  getOrganizationSubscription
);

router.post(
  "/",
  protect,
  requireOrgAdmin,
  createOrganization
);

export default router;