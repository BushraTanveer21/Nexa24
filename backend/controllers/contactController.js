import Contact from "../models/Contact.js";

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message, website } = req.body || {};

    if (website) {
      return res.status(201).json({ message: "Message sent successfully." });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ message: "Phone is required" });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const contact = await Contact.create(req.body);

    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// admin only - view all inquiries (optional ?status=New|Contacted|Done filter)
export const getContacts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: "Inquiry not found" });
    res.json({ message: "Inquiry deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// admin only - update inquiry status (New / Contacted / Done) or read state
export const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!contact) return res.status(404).json({ message: "Inquiry not found" });
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};