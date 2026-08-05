import express from "express";
import {
  submitContact,
  getContacts,
  deleteContact,
  updateContact,
} from "../controllers/contactController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", submitContact); // public - visitor submits form
router.get("/", protect, getContacts); // admin only - view inquiries
router.put("/:id", protect, updateContact); // admin only - update status
router.delete("/:id", protect, deleteContact); // admin only

export default router;