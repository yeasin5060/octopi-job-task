import express from "express";

import {
  me,
  forgotPassword,
  login,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";



const router = express.Router();

router.post("/login", login);

router.get("/me", protect, me);

router.post(
  "/forgot-password",
  forgotPassword
);

export default router;