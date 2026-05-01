import nodemailer from "nodemailer";

/**
 * Email Sender Service
 * Uses SMTP settings from .env
 */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendLeaveEmail(to: string, subject: string, text: string, replyTo?: string) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'hr@onlyai.com',
      to,
      subject,
      text,
      replyTo: replyTo || undefined,
    });

    console.log("📧 Email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("❌ Email error:", error.message);
    return { success: false, error: error.message };
  }
}
