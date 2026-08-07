import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: String },
    message: { type: String },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    email: { type: String },
    videoUrl: { type: String },
    image: { type: String },
    isEnabled: { type: Boolean, default: true },
    isClientSubmitted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);
