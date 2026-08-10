import cloudinary from "../config/cloudinary.js";

// admin only - upload an image file to Cloudinary and return its URL.
// Expects a single file under the "image" field (multipart/form-data).
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "nexa24",
      resource_type: "image",
    });

    res.status(201).json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    res.status(500).json({ message: error.message || "Image upload failed" });
  }
};

export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video file provided" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "nexa24",
        resource_type: "video",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary video upload error:", error);
          if (!res.headersSent) {
            return res.status(500).json({ message: error.message || "Video upload failed" });
          }
          return;
        }
        if (!res.headersSent) {
          res.status(201).json({ url: result.secure_url, publicId: result.public_id });
        }
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error("Upload video outer catch error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: error.message || "Video upload failed" });
    }
  }
};

// admin only - deletes an image from Cloudinary immediately (used by the
// "Clear Image" button so removed images don't sit around as orphaned
// uploads until the parent form happens to be saved).
export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body || {};
    if (!publicId) {
      return res.status(400).json({ message: "publicId is required" });
    }

    await cloudinary.uploader.destroy(publicId);
    res.json({ message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Image delete failed" });
  }
};