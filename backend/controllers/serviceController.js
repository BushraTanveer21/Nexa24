import Service from "../models/Service.js";

import cloudinary from "../config/cloudinary.js";

// Fields clients are allowed to set. Keeps req.body from mass-assigning
// anything else that gets added to the schema later.
const ALLOWED_FIELDS = [
  "title",
  "description",
  "icon",
  "image",
  "imagePublicId",
  "order",
  "isActive",
  "benefits",
];

const pickAllowed = (body = {}) =>
  ALLOWED_FIELDS.reduce((acc, key) => {
    if (body[key] !== undefined) acc[key] = body[key];
    return acc;
  }, {});

// Safely delete an image from Cloudinary. Never throws — a failed cleanup
// shouldn't block the actual service create/update/delete from succeeding.
const destroyCloudinaryImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn("Cloudinary cleanup failed for", publicId, err.message);
  }
};

// Public — Home & Services page. Only active services.
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin only — returns ALL services regardless of isActive, so disabled
// services stay visible/editable in the dashboard instead of disappearing.
export const getAdminServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { title, description } = req.body || {};
    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Service title is required" });
    }
    if (!description || typeof description !== "string" || !description.trim()) {
      return res.status(400).json({ message: "Service description is required" });
    }

    const data = pickAllowed(req.body);

    // If the requested order is already taken by another service, that
    // service didn't get bumped to make room — push it to the end of the
    // list (next available slot) so both services end up with unique orders.
    if (data.order !== undefined) {
      const desiredOrder = Number(data.order);
      const conflict = await Service.findOne({ order: desiredOrder });
      if (conflict) {
        const highest = await Service.findOne().sort({ order: -1 });
        conflict.order = (highest?.order || 0) + 1;
        await conflict.save();
      }
    }

    const service = await Service.create(data);
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    if (
      req.body?.title !== undefined &&
      (typeof req.body.title !== "string" || !req.body.title.trim())
    ) {
      return res.status(400).json({ message: "Service title cannot be empty" });
    }
    if (
      req.body?.description !== undefined &&
      (typeof req.body.description !== "string" || !req.body.description.trim())
    ) {
      return res.status(400).json({ message: "Service description cannot be empty" });
    }

    // Grab the existing doc first so we know the OLD image's public_id
    // before it gets overwritten — needed to clean up the old upload
    // whenever the admin replaces it with a new one.
    const existing = await Service.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Service not found" });

    const updates = pickAllowed(req.body);

    // Order swap: if this service is moving to an order another service
    // already holds, give that other service the order we're vacating —
    // so the two effectively swap places instead of ending up with a
    // duplicate order number.
    if (updates.order !== undefined) {
      const desiredOrder = Number(updates.order);
      if (desiredOrder !== existing.order) {
        const conflict = await Service.findOne({
          order: desiredOrder,
          _id: { $ne: existing._id },
        });
        if (conflict) {
          conflict.order = existing.order;
          await conflict.save();
        }
      }
    }

    const isReplacingImage =
      updates.imagePublicId !== undefined &&
      existing.imagePublicId &&
      updates.imagePublicId !== existing.imagePublicId;

    const service = await Service.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (isReplacingImage) {
      await destroyCloudinaryImage(existing.imagePublicId);
    }

    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    // Clean up the associated Cloudinary upload so removing a service
    // doesn't leave an orphaned image behind.
    await destroyCloudinaryImage(service.imagePublicId);

    res.json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};