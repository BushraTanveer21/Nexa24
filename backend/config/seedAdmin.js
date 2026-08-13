import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

const defaultAdmin = {
  name: "NEXA24 Admin",
  email: process.env.DEFAULT_ADMIN_EMAIL || "admin@nexa24.com",
  password: process.env.DEFAULT_ADMIN_PASSWORD || "admin123",
};
const seedAdmin = async () => {
  try {
    const anyAdminExists = await Admin.exists({});
    if (anyAdminExists) {
      return; 
    }

    const normalizedEmail = defaultAdmin.email.toLowerCase().trim();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultAdmin.password, salt);

    await Admin.create({
      name: defaultAdmin.name,
      email: normalizedEmail,
      password: hashedPassword,
    });
    console.log(`🔐 Initial admin account created for ${normalizedEmail}.`);
  } catch (error) {
    console.error("Failed to seed admin user:", error.message);
  }
};

export default seedAdmin;