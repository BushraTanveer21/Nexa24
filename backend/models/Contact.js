import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }, // required per contact form fields
    organization: { type: String },
    service: { type: String },
    subject: { type: String, default: "General Inquiry" },
    message: { type: String, required: true },
    status: { type: String, enum: ["New", "In Progress", "Contacted", "Handled", "Done"], default: "New" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

export default mongoose.model("Contact", contactSchema);