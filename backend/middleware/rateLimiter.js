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
