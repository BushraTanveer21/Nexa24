import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: String },
    message: { type: String },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    date: { type: Date, default: Date.now },
    email: { type: String },
    videoUrl: { type: String },
    image: { type: String },
    order: { type: Number, required: true, default: 0 },
    isEnabled: {
      type: Boolean,
      default: function () {
        return !this.isClientSubmitted;
      },
    },
    isFeatured: { type: Boolean, default: false },
    isClientSubmitted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

testimonialSchema.index({ isEnabled: 1, order: 1 });
testimonialSchema.index({ isFeatured: 1, order: 1 });

export default mongoose.model("Testimonial", testimonialSchema);