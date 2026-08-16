import express from "express";

import {
  getMembers,
  updateMemberRole,
  removeMember,
} from "../controllers/member.controller.js";


import { authorize, requireOrgAdmin } from "../middlewares/role.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  
  getMembers
);

router.patch(
  "/:id/role",
  protect,
  requireOrgAdmin,
  updateMemberRole
);

router.delete(
  "/:id",
  protect,
  requireOrgAdmin,
  removeMember
);

export default router;