import express from "express";

import {
  handleStripeWebhook,
} from "../controllers/webhook.controller.js";

const router = express.Router();

router.post(
  "/",
  handleStripeWebhook
);

export default router;