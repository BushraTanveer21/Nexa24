import Contact from "../models/Contact.js";

// public - visitor submits the contact form
// Expects: { name, email, phone, message, subject?, website }
// "website" is the honeypot field - must stay empty. Give it a real-looking
// name and hide it with CSS (display:none / off-screen), NOT type="hidden",
// since some bots skip type="hidden" inputs.
export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message, website } = req.body || {};

    // Honeypot check: if filled, pretend success so the bot doesn't learn
    // its submission was rejected. Nothing gets saved.
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

// admin only - view all inquiries with search & filter support
export const getContacts = async (req, res) => {
  try {
    const { search, status, isRead } = req.query || {};
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (isRead !== undefined && isRead !== "") {
      filter.isRead = isRead === "true";
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { organization: regex },
        { service: regex },
        { subject: regex },
        { message: regex },
      ];
    }

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