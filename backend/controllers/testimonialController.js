import Testimonial from "../models/Testimonial.js";

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isEnabled: true });
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
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Testimonial message is required" });
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
    if (req.body?.message !== undefined && !req.body.message.trim()) {
      return res.status(400).json({ message: "Testimonial message cannot be empty" });
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
    res.json({ message: "Testimonial deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
