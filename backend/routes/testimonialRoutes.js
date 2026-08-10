import express from "express";
import {
  getTestimonials,
  getFeaturedTestimonials,
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  submitTestimonial,
  approveTestimonial,
  toggleFeatured,
  setTestimonialOrder,
  reorderTestimonials,
} from "../controllers/testimonialController.js";
import protect from "../middleware/authMiddleware.js";
import { testimonialSubmissionLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// ---------- Public ----------
router.get("/", getTestimonials); // public
router.get("/featured", getFeaturedTestimonials); // public, for Home page preview
router.post("/public", testimonialSubmissionLimiter, submitTestimonial); // public submission

// ---------- Admin only ----------
// Note: put "/admin/reorder" above "/:id" routes so "reorder" isn't
// swallowed as an :id param.
router.get("/admin", protect, getAdminTestimonials);
router.patch("/admin/reorder", protect, reorderTestimonials);
router.patch("/admin/:id/order", protect, setTestimonialOrder);
router.patch("/admin/:id/approve", protect, approveTestimonial);
router.patch("/admin/:id/toggle-featured", protect, toggleFeatured);
router.post("/", protect, createTestimonial);
router.put("/:id", protect, updateTestimonial);
router.delete("/:id", protect, deleteTestimonial);

export default router;