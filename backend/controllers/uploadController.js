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
