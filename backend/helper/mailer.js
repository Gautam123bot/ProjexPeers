import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMailToUser = async (email, subject, content) => {
  try {
    if (!email) {
      throw new Error("No recipient email provided.");
    }
    const mailOptions = {
      from: process.env.SMTP_USER, 
      to: email,                         
      subject: subject,                 
      html: content,                    
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.messageId);

    // return res.status(200).json({
    //   success: true,
    //   message: "OTP has been sent to your email",
    //   info: info,
    // });
    return { success: true, info: info };
  } catch (error) {
    console.log("Error in sendMailToUser function:", error);
    // return res.status(500).json({ error: error.message || "Internal Server Error" });
    throw error;
  }
};

export default sendMailToUser;