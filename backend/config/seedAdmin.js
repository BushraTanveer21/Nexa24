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

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);

      if (!existing) {
        await Admin.create({
          name: adminData.name,
          email: normalizedEmail,
          password: hashedPassword,
        });
        console.log(`🔐 Admin account created for ${normalizedEmail}. Password set from env/config — check with whoever set it up.`);
      } else {
        existing.password = hashedPassword;
        await existing.save();
        console.log(`🔐 Admin credentials verified for ${normalizedEmail}.`);
      }
    }
  } catch (error) {
    console.error("Failed to seed admin users:", error.message);
  }
};

export default seedAdmin;