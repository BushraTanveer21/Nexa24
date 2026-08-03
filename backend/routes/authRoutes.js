import express from "express";
import {
  loginAdmin,
  registerAdmin,
  forgotPassword,
  resetPassword,
  getMe,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/login", loginLimiter, loginAdmin);
router.post("/register", protect, registerAdmin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", protect, getMe);

export default router;
