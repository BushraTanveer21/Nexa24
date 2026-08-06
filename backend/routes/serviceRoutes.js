import express from "express";
import {
  getServices,
  getAdminServices,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getServices); // public - Home & Services page (active only)
router.get("/admin", protect, getAdminServices); // admin only - all services, including disabled
router.post("/", protect, createService); // admin only
router.put("/:id", protect, updateService); // admin only
router.delete("/:id", protect, deleteService); // admin only

export default router;