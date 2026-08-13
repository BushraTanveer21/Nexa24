import express from "express";
import multer from "multer";
import { uploadImage, uploadVideo, deleteImage } from "../controllers/uploadController.js";
import { publicUploadLimiter } from "../middleware/rateLimiter.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();



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
  limits: { fileSize: 50 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("Only video files are allowed"));
    }
    cb(null, true);
  },
});


const handleUpload = (multerMiddleware) => (req, res, next) => {
  multerMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File size exceeds limit! Maximum size is 5MB for images and 50MB for videos." });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

router.post("/", protect, handleUpload(upload.single("image")), uploadImage);
router.post("/video", protect, handleUpload(uploadVideoLimit.single("video")), uploadVideo);
router.delete("/", protect, deleteImage);

router.post("/public/image", publicUploadLimiter, handleUpload(upload.single("image")), uploadImage);
router.post("/public/video", publicUploadLimiter, handleUpload(uploadVideoLimit.single("video")), uploadVideo);

export default router;