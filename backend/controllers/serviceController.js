import Service from "../models/Service.js";

export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
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

    const service = await Service.create(req.body);
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

    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
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
    res.json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
