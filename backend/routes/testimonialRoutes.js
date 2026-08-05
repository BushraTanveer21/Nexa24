import express from "express";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getTestimonials); // public
router.post("/", protect, createTestimonial); // admin only
router.put("/:id", protect, updateTestimonial); // admin only
router.delete("/:id", protect, deleteTestimonial); // admin only

export default router;
