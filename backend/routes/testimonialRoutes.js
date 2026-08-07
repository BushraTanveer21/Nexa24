import express from "express";
import {
  getTestimonials,
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  submitTestimonial,
} from "../controllers/testimonialController.js";
import protect from "../middleware/authMiddleware.js";
import { testimonialSubmissionLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/", getTestimonials); // public
router.get("/admin", protect, getAdminTestimonials); // admin only
router.post("/public", testimonialSubmissionLimiter, submitTestimonial); // public submission
router.post("/", protect, createTestimonial); // admin only
router.put("/:id", protect, updateTestimonial); // admin only
router.delete("/:id", protect, deleteTestimonial); // admin only

export default router;
