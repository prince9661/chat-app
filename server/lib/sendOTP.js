import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `Chat App <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `<h3>Your OTP is: <b>${otp}</b></h3><p>This OTP is valid for 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully");
  } catch (err) {
    console.error("Email error:", err.message);
    throw new Error("Failed to send email");
  }
};
