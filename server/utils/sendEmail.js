import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  try {
    // ১. Gmail এর জন্য ট্রান্সপোর্টার তৈরি
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        // সরাসরি ইমেইল/পাসওয়ার্ড এখানে না লিখে নিচের মতো করে লিখো
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // ২. ইমেইল অপশন সেটআপ
    const mailOptions = {
      from: `"GOOGIZ Support" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e4; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p style="font-size: 16px; color: #555;">Hi,</p>
          <p style="font-size: 16px; color: #555;">
            You requested to reset your password for your <strong>GOOGIZ</strong> account. Please click the button below to proceed:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${options.url}" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Reset My Password
            </a>
          </div>
          <p style="font-size: 14px; color: #888;">
            This link is valid for <strong>1 hour</strong> only. If you didn't request this, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #aaa; text-align: center;">
            &copy; 2026 GOOGIZ AI Tools. All rights reserved.
          </p>
        </div>
      `,
    };

    // ৩. ইমেইল পাঠানো
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: " + info.response);
    
  } catch (error) {
    console.error("Error in sending email:", error);
    throw new Error("Email could not be sent.");
  }
};

export default sendEmail;