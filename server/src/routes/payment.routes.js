import express from "express";

import {
  createCheckoutSession,
} from "../controllers/payment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";



const router = express.Router();

router.post(
  "/checkout",
  protect,
  createCheckoutSession
);

export default router;