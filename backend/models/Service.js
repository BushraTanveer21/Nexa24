import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String },
    image: { type: String },
    // Cloudinary public_id for the uploaded image. Required to delete the
    // image from Cloudinary later — the URL alone isn't enough for that.
    imagePublicId: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    // Detail-page fields (previously hardcoded in the frontend):
    // The short purple highlight line next to the service title
    // (e.g. "Real Results.") — admin can now customize this per service.
    subtitle: { type: String, default: "" },
    // The row of benefit "pills" shown on the detail page, each with its
    // own label + icon key (see frontend/src/utils/iconMap.js for the
    // list of supported icon keys).
    benefits: {
      type: [
        {
          label: { type: String, required: true },
          icon: { type: String, default: "check" },
          // Longer explanation shown on the "What Our ... Handle" card that
          // corresponds to this benefit pill. Optional — falls back to the
          // hand-written per-service copy when left blank.
          description: { type: String, default: "" },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);