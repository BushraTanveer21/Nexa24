import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);
adminSchema.pre("save", async function (next) {
  if (this.isNew) {
    const existingCount = await mongoose.models.Admin.countDocuments();
    if (existingCount >= 1) {
      const err = new Error(
        "Only one admin account is allowed. Change the existing admin's email/password from Profile Settings instead of creating a new one."
      );
      return next(err);
    }
  }
  next();
});

export default mongoose.model("Admin", adminSchema);