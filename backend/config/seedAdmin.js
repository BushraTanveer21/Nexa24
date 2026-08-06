import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

const defaultAdmins = [
  {
    name: "NEXA24 Admin",
    email: process.env.DEFAULT_ADMIN_EMAIL || "admin@nexa24.com",
    password: process.env.DEFAULT_ADMIN_PASSWORD || "admin123",
  },
];

const seedAdmin = async () => {
  try {
    for (const adminData of defaultAdmins) {
      const normalizedEmail = adminData.email.toLowerCase().trim();
      const existing = await Admin.findOne({ email: normalizedEmail });

      if (!existing) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        await Admin.create({
          name: adminData.name,
          email: normalizedEmail,
          password: hashedPassword,
        });
        console.log(`🔐 Admin account created for ${normalizedEmail}.`);
      } else {
        console.log(`🔐 Admin already exists for ${normalizedEmail}, skipping seed.`);
      }
    }
  } catch (error) {
    console.error("Failed to seed admin users:", error.message);
  }
};

export default seedAdmin;