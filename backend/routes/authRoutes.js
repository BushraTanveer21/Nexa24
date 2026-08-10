import express from "express";
import {
  loginAdmin,
  getMe,
  updateProfile,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/login", loginLimiter, loginAdmin);
router.get("/me", protect, getMe);
router.put("/profile", protect, loginLimiter, updateProfile);

export default router;