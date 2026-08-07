import rateLimit from "express-rate-limit";

// Limits repeated login attempts from the same IP to slow down brute-force
// password guessing against admin accounts.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per IP per window
  message: { message: "Too many login attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Tighter limit for forgot-password since each hit triggers an email send
export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 reset requests per IP per window
  message: { message: "Too many reset requests. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const testimonialSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 submissions per IP per 15 mins
  message: { message: "Too many submissions. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const publicUploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 6, // 6 uploads per IP per 15 mins
  message: { message: "Too many uploads. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});