import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/uploadController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Keep the file in memory (not written to disk) and cap size at 5MB —
// plenty for a service/testimonial photo, small enough to stop abuse.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

const uploadVideoLimit = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for videos
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("Only video files are allowed"));
    }
    cb(null, true);
  },
});

import { uploadVideo } from "../controllers/uploadController.js";
import { publicUploadLimiter } from "../middleware/rateLimiter.js";

router.post("/", protect, upload.single("image"), uploadImage);
router.post("/video", protect, uploadVideoLimit.single("video"), uploadVideo);

router.post("/public/image", publicUploadLimiter, upload.single("image"), uploadImage);
router.post("/public/video", publicUploadLimiter, uploadVideoLimit.single("video"), uploadVideo);

export default router;
