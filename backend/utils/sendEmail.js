import { Resend } from "resend";

// Sends a password reset email with the reset link. Throws if it fails,
// so callers can decide how to respond to the client.
export const sendPasswordResetEmail = async (toEmail, resetUrl) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set in .env — password reset emails can't be sent.");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    // resend.dev works out of the box with no domain setup, but only
    // delivers to the email you signed up with. Once you verify your own
    // domain in Resend, switch this to something like
    // "NEXA24 Healthcare <noreply@nexa24healthcare.com>".
    from: "NEXA24 Healthcare <onboarding@resend.dev>",
    to: toEmail,
    subject: "Reset your NEXA24 Healthcare admin password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #6b21a8;">Password Reset Request</h2>
        <p>We received a request to reset the password for this admin account.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block; background:#6b21a8; color:#fff; padding:10px 20px; border-radius:6px; text-decoration:none;">
            Reset Password
          </a>
        </p>
        <p>This link expires in 30 minutes. If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  });
};