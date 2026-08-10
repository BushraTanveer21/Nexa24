import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
const generateToken = (id) =>
  jwt.sign({ id: id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

// @route   POST /api/auth/login
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide both email and password" });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin profile not found" });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/auth/profile
// Updates the logged-in admin's email and/or password. Requires the
// admin's current password to confirm the change, so a stolen/leaked
// JWT alone isn't enough to take over the account.
export const updateProfile = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { currentPassword, newEmail, newPassword } = req.body || {};

    if (!currentPassword) {
      return res.status(400).json({ message: "Current password is required" });
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin profile not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    if (newEmail && newEmail.trim()) {
      const normalizedEmail = newEmail.toLowerCase().trim();
      if (normalizedEmail !== admin.email) {
        const existing = await Admin.findOne({ email: normalizedEmail });
        if (existing) {
          return res.status(409).json({ message: "That email is already in use" });
        }
        admin.email = normalizedEmail;
      }
    }

    if (newPassword && newPassword.trim()) {
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters" });
      }
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(newPassword, salt);
    }

    await admin.save();

    // Reissue token since identity may have changed
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};