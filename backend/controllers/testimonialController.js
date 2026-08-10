import Testimonial from "../models/Testimonial.js";
import cloudinary from "../config/cloudinary.js";

// Helper function to remove media from Cloudinary
const deleteFromCloudinary = async (url, isVideo = false) => {
  if (!url || !url.includes("cloudinary.com")) return;
  const splitUrl = url.split("/upload/");
  if (splitUrl.length === 2) {
    let path = splitUrl[1];
    if (path.match(/^v\d+\//)) {
      path = path.replace(/^v\d+\//, "");
    }
    const lastDotIndex = path.lastIndexOf(".");
    const publicId = lastDotIndex !== -1 ? path.substring(0, lastDotIndex) : path;
    if (publicId) {
      try {
        if (isVideo) {
          await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
        } else {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (err) {
        console.error(`Failed to delete ${isVideo ? 'video' : 'image'} from Cloudinary:`, err.message);
      }
    }
  }
};

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isEnabled: true });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({});
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    const { name, message } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Client name is required" });
    }
    if (!message?.trim() && !req.body.videoUrl) {
      return res.status(400).json({ message: "Either a text message or a video is required" });
    }

    const testimonial = await Testimonial.create(req.body);
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    if (req.body?.name !== undefined && !req.body.name.trim()) {
      return res.status(400).json({ message: "Client name cannot be empty" });
    }

    const existing = await Testimonial.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Testimonial not found" });

    // If image is being updated or cleared, delete the old Cloudinary image
    if (req.body.image !== undefined && req.body.image !== existing.image) {
      await deleteFromCloudinary(existing.image, false);
    }

    // If videoUrl is being updated or cleared, delete the old Cloudinary video
    if (req.body.videoUrl !== undefined && req.body.videoUrl !== existing.videoUrl) {
      await deleteFromCloudinary(existing.videoUrl, true);
    }

    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });

    // Delete image and video from Cloudinary if hosted there
    await deleteFromCloudinary(testimonial.image, false);
    await deleteFromCloudinary(testimonial.videoUrl, true);

    res.json({ message: "Testimonial deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitTestimonial = async (req, res) => {
  try {
    const { name, message, videoUrl } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Client name is required" });
    }
    if ((!message || !message.trim()) && !videoUrl) {
      return res.status(400).json({ message: "Either a text message or a video is required" });
    }

    // Force isEnabled to false so it requires admin approval
    const testimonialData = {
      ...req.body,
      isEnabled: false,
      isClientSubmitted: true,
    };

    const testimonial = await Testimonial.create(testimonialData);
    res.status(201).json({ message: "Testimonial submitted successfully and is pending review.", testimonial });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
