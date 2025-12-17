import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",  // or your provider (Yahoo, Outlook, etc.)
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,  // your email
    pass: process.env.EMAIL_PASS,  // your app password
  },
});

export async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"E-Commerce App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Email sent to", to);
  } catch (err) {
    console.error("❌ Email error:", err);
  }
}
// export default transporter;
// File: routes/admin.js