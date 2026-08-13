import "dotenv/config";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import seedAdmin from "./config/seedAdmin.js";

import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();


connectDB().then(() => {
  seedAdmin();
}).catch((err) => {
  console.error("DB Connection Error:", err);
});

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => res.send("NEXA24 Healthcare API is running..."));


app.use((err, req, res, next) => {
  if (err) {
    return res.status(err.status || 400).json({ message: err.message || "Something went wrong" });
  }
  next();
});


const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}


export default app;