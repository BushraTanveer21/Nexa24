import express from "express";
import {
  loginAdmin,
  forgotPassword,
  resetPassword,
  getMe,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import { loginLimiter, forgotPasswordLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/login", loginLimiter, loginAdmin);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", protect, getMe);

export default router;