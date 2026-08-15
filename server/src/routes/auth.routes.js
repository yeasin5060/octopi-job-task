import express from "express";

import {
  me,
  forgotPassword,
  login,
  resetPassword,
  register,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";



const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", protect, me);

router.post(
  "/forgot-password",
  forgotPassword
);

// Reset password
router.post(
  "/reset-password/:token",
  resetPassword
);


export default router;