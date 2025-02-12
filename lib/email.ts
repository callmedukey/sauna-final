import nodemailer from "nodemailer";

// Create a reusable transporter object using environment variables
const transporter = nodemailer.createTransport({
  service: "smtp",
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    // Reject unauthorized connections
    rejectUnauthorized: true,
    // Minimum TLS version requirement
    minVersion: "TLSv1.2",
  },
});

// Create an async function to send emails
export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  try {
    // Input validation
    if (!to || !subject || (!text && !html)) {
      throw new Error("Missing required email parameters");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      throw new Error("Invalid email format");
    }

    const mailOptions = {
      from: `"솔로사우나레포" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
