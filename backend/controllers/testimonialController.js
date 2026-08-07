import Testimonial from "../models/Testimonial.js";
import cloudinary from "../config/cloudinary.js";

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
    if (req.body?.message !== undefined && !req.body.message.trim() && !req.body.videoUrl) {
      // It's allowed to be empty if they provide a video
      // But if they empty it out and have no video, we could block it. Let's just let the schema handle it.
    }

    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });
    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });

    // If testimonial has an image hosted on Cloudinary, delete it from there too
    if (testimonial.image && testimonial.image.includes("cloudinary.com")) {
      const splitUrl = testimonial.image.split("/upload/");
      if (splitUrl.length === 2) {
        let path = splitUrl[1];
        if (path.match(/^v\d+\//)) {
          path = path.replace(/^v\d+\//, "");
        }
        const lastDotIndex = path.lastIndexOf(".");
        const publicId = lastDotIndex !== -1 ? path.substring(0, lastDotIndex) : path;
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (cloudinaryErr) {
            console.error("Failed to delete image from Cloudinary:", cloudinaryErr.message);
          }
        }
      }
    }

    // If testimonial has a video hosted on Cloudinary, delete it from there too
    if (testimonial.videoUrl && testimonial.videoUrl.includes("cloudinary.com")) {
      const splitUrl = testimonial.videoUrl.split("/upload/");
      if (splitUrl.length === 2) {
        let path = splitUrl[1];
        if (path.match(/^v\d+\//)) {
          path = path.replace(/^v\d+\//, "");
        }
        const lastDotIndex = path.lastIndexOf(".");
        const publicId = lastDotIndex !== -1 ? path.substring(0, lastDotIndex) : path;
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
          } catch (cloudinaryErr) {
            console.error("Failed to delete video from Cloudinary:", cloudinaryErr.message);
          }
        }
      }
    }

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
