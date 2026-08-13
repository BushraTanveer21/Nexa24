import Service from "../models/Service.js";

import cloudinary from "../config/cloudinary.js";


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



const destroyCloudinaryImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn("Cloudinary cleanup failed for", publicId, err.message);
  }
};


export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



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

    
    
    
    const existing = await Service.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Service not found" });

    const updates = pickAllowed(req.body);

    
    
    
    
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

    
    
    await destroyCloudinaryImage(service.imagePublicId);

    res.json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};