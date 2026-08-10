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

    // Controls display order on the /testimonials page and in the admin list.
    // New testimonials get pushed to the end (set in the controller on create).
    order: { type: Number, required: true, default: 0 },

    // Whether it's visible on the public /testimonials page at all.
    // Client-submitted ones default to false so an admin has to approve
    // them first; admin-added ones default to true (already vetted).
    isEnabled: {
      type: Boolean,
      default: function () {
        return !this.isClientSubmitted;
      },
    },

    // Independent of isEnabled — lets admin pick which 2-3 enabled
    // testimonials show in the Home page preview.
    isFeatured: { type: Boolean, default: false },

    // True if this came in through a public "submit your testimonial"
    // form rather than being added directly by an admin.
    isClientSubmitted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

testimonialSchema.index({ isEnabled: 1, order: 1 });
testimonialSchema.index({ isFeatured: 1, order: 1 });

export default mongoose.model("Testimonial", testimonialSchema);