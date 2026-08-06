import Service from "../models/Service.js";

// Fields clients are allowed to set. Keeps req.body from mass-assigning
// anything else that gets added to the schema later.
const ALLOWED_FIELDS = ["title", "description", "icon", "image", "order", "isActive"];

const pickAllowed = (body = {}) =>
  ALLOWED_FIELDS.reduce((acc, key) => {
    if (body[key] !== undefined) acc[key] = body[key];
    return acc;
  }, {});

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
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Service title is required" });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Service description is required" });
    }

    const service = await Service.create(pickAllowed(req.body));
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    if (req.body?.title !== undefined && !req.body.title.trim()) {
      return res.status(400).json({ message: "Service title cannot be empty" });
    }
    if (req.body?.description !== undefined && !req.body.description.trim()) {
      return res.status(400).json({ message: "Service description cannot be empty" });
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      pickAllowed(req.body),
      { new: true, runValidators: true }
    );
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    // TODO: if you store the Cloudinary public_id on the service doc,
    // delete the image here too (cloudinary.uploader.destroy(publicId))
    // so removing a service doesn't leave an orphaned upload behind.

    res.json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};