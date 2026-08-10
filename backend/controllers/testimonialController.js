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

// Helper: next order value = current max + 1, so new items go to the end.
const getNextOrder = async () => {
  const last = await Testimonial.findOne().sort({ order: -1 });
  return last ? last.order + 1 : 0;
};

// ---------- Public ----------

// GET /api/testimonials — used by the /testimonials page
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isEnabled: true }).sort({ order: 1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/testimonials/featured — used by the Home page preview
export const getFeaturedTestimonials = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 3;
    const testimonials = await Testimonial.find({ isEnabled: true, isFeatured: true })
      .sort({ order: 1 })
      .limit(limit);
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/testimonials/submit — public client submission, pending review
export const submitTestimonial = async (req, res) => {
  try {
    const { name, message, videoUrl } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Client name is required" });
    }
    if ((!message || !message.trim()) && !videoUrl) {
      return res.status(400).json({ message: "Either a text message or a video is required" });
    }

    const testimonialData = {
      ...req.body,
      isEnabled: false, // forced regardless of the model's conditional default — always pending on submit
      isClientSubmitted: true,
      order: await getNextOrder(),
    };

    const testimonial = await Testimonial.create(testimonialData);
    res.status(201).json({ message: "Testimonial submitted successfully and is pending review.", testimonial });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ---------- Admin ----------

// GET /api/admin/testimonials — everything, enabled or not, in order
export const getAdminTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).sort({ order: 1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/admin/testimonials — admin adds one directly (already vetted)
export const createTestimonial = async (req, res) => {
  try {
    const { name, message } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Client name is required" });
    }
    if (!message?.trim() && !req.body.videoUrl) {
      return res.status(400).json({ message: "Either a text message or a video is required" });
    }

    const testimonial = await Testimonial.create({
      ...req.body,
      order: await getNextOrder(),
    });
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

    // Re-index remaining testimonials sequentially
    const remaining = await Testimonial.find().sort({ order: 1 });
    const bulkOps = remaining.map((t, index) => ({
      updateOne: {
        filter: { _id: t._id },
        update: { order: index },
      },
    }));
    if (bulkOps.length > 0) {
      await Testimonial.bulkWrite(bulkOps);
    }

    res.json({ message: "Testimonial deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/admin/testimonials/:id/approve — admin approves a pending
// client submission (sets isEnabled true so it shows on /testimonials)
export const approveTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });

    testimonial.isEnabled = true;
    await testimonial.save();

    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PATCH /api/admin/testimonials/:id/toggle-featured
export const toggleFeatured = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });

    testimonial.isFeatured = !testimonial.isFeatured;
    await testimonial.save();

    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PATCH /api/admin/testimonials/:id/order
// Body: { order: <desired index, 0-based> }
// This is what the admin panel's editable "Order" number input should call
// instead of a plain field update. It moves this testimonial to the
// requested position and re-indexes every other testimonial around it, so
// two rows can never end up sharing the same order value.
export const setTestimonialOrder = async (req, res) => {
  try {
    const { order: requestedOrder } = req.body;
    if (typeof requestedOrder !== "number" || requestedOrder < 0) {
      return res.status(400).json({ message: "order must be a non-negative number" });
    }

    const all = await Testimonial.find({}).sort({ order: 1 });
    const target = all.find((t) => t._id.toString() === req.params.id);
    if (!target) return res.status(404).json({ message: "Testimonial not found" });

    const oldOrder = target.order !== undefined ? target.order : 0;
    if (oldOrder === requestedOrder) {
      return res.json(all);
    }

    // Step 1: Perform pairwise swap in memory
    const updatedAll = all.map(t => {
      if (t._id.toString() === req.params.id) {
        return { ...t.toObject(), order: requestedOrder };
      }
      if (t.order === requestedOrder) {
        return { ...t.toObject(), order: oldOrder };
      }
      return t.toObject();
    });

    // Step 2: Re-sort the mapped array by order to maintain sequential placement
    updatedAll.sort((a, b) => a.order - b.order);

    // Step 3: Re-index 0, 1, 2, 3... to scrub out any existing duplicate bugs (like two 4's)
    const bulkOps = updatedAll.map((t, index) => ({
      updateOne: { filter: { _id: t._id }, update: { order: index } }
    }));

    await Testimonial.bulkWrite(bulkOps);

    const testimonials = await Testimonial.find({}).sort({ order: 1 });
    res.json(testimonials);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PATCH /api/admin/testimonials/reorder
// Body: { order: [id1, id2, id3, ...] } — full list of IDs in new order,
// sent whenever the admin drags-and-drops testimonials into a new sequence.
export const reorderTestimonials = async (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ message: "order must be a non-empty array of testimonial IDs" });
    }

    const bulkOps = order.map((id, index) => ({
      updateOne: { filter: { _id: id }, update: { order: index } },
    }));
    await Testimonial.bulkWrite(bulkOps);

    const testimonials = await Testimonial.find({}).sort({ order: 1 });
    res.json(testimonials);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};