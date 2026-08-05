import express from "express";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getServices); // public - Home & Services page
router.post("/", protect, createService); // admin only
router.put("/:id", protect, updateService); // admin only
router.delete("/:id", protect, deleteService); // admin only

export default router;
