import nodemailer from 'nodemailer';

export const sendOTPEmail = async (email, otp,fullName) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Your OTP Code",
    html: `<h2>Dear ${fullName}<h2><h3>Your OTP is <b>${otp}</b></h3><p>It is valid for 5 minutes only.</p>`
  };

  await transporter.sendMail(mailOptions);
};
