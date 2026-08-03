import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, default: "General Inquiry" },
    message: { type: String, required: true },
    status: { type: String, enum: ["New", "In Progress", "Handled"], default: "New" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);