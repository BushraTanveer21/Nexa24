import rateLimit from "express-rate-limit";



export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: { message: "Too many login attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const testimonialSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 3, 
  message: { message: "Too many submissions. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const publicUploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 6, 
  message: { message: "Too many uploads. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});