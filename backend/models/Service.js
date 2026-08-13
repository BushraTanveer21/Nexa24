import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String },
    image: { type: String },
    
    
    imagePublicId: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    
    
    
    benefits: {
      type: [
        {
          label: { type: String, required: true },
          icon: { type: String, default: "check" },
          
          
          
          description: { type: String, default: "" },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);