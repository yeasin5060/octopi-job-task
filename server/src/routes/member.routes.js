import express from "express";

import {
  getMembers,
  updateMemberRole,
  removeMember,
} from "../controllers/member.controller.js";


import { authorize } from "../middlewares/role.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("ORG_ADMIN"),
  getMembers
);

router.patch(
  "/:id/role",
  protect,
  authorize("ORG_ADMIN"),
  updateMemberRole
);

router.delete(
  "/:id",
  protect,
  authorize("ORG_ADMIN"),
  removeMember
);

export default router;