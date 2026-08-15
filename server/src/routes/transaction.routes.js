import express from "express";

import {
  getMyTransactions,
} from "../controllers/transaction.controller.js";



import { authorize } from "../middlewares/role.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("ORG_ADMIN"),
  getMyTransactions
);

export default router;