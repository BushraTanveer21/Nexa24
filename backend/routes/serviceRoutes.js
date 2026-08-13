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

router.get("/", getServices); 
router.get("/admin", protect, getAdminServices); 
router.post("/", protect, createService); 
router.put("/:id", protect, updateService); 
router.delete("/:id", protect, deleteService); 

export default router;