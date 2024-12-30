import sendMailToUser from "../helper/mailer.js";
import User from "../models/user.js";

const otpStore = {};

const generateRandom6Digit = async() => {
    return Math.floor(100000 + Math.random() * 900000);
}

// Controller for sending OTP
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }
    console.log("Entered email is: ", email);

    // Check if the email is already registered
    const userData = await User.findOne({ email: email });
    if (userData) {
      return res.status(400).json({
        success: false,
        message: "Email already exists!"
      });
    }

    // Generate a random OTP
    const generatedOtp = await generateRandom6Digit();
    // await Otp.findOneAndDelete({ email });
    // console.log("Generated OTP: ", generatedOtp);

    // // Save OTP in the database
    // const otpEntry = new Otp({
    //   email: email,
    //   otp: generatedOtp
    // });
    // await otpEntry.save();
    otpStore[email] = {
      otp: generatedOtp,
      createdAt: Date.now(),
    };

    const msg = `<p> Hi <b>${email}</b>, </p><br><p> Your OTP for ProjexPeers is: ${generatedOtp} </p><br><p> Regards, <br> ProjexPeers Team </p>`;
    console.log("OTP: ", generatedOtp);
    // await sendMailToUser(req, res, email, "OTP for ProjexPeers", msg);
    const info = await sendMailToUser(email, "Password Reset OTP", msg);

    if (!info.success) {
      return res.status(500).json({
        message: "Failed to send OTP. Please try again later.",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      message: "OTP has been sent to your email",
    });
  } catch (e) {
    console.log("Could not find user --> ", e);
    res.status(500).json({ success: false, message: `Could not send OTP --> ${e}` });
  }
};

// Controller for verifying OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the OTP entry for the provided email
    const otpData = otpStore[email];
    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "OTP not found for this email"
      });
    }

    const expirationTime = 10 * 60 * 1000; // 10 minutes in milliseconds
    if (Date.now() - otpData.createdAt > expirationTime) {
      delete otpStore[email];
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }
    console.log("Entered otp is: ", otp, "OTP from db is: ", otpData.otp);
    // Check if the OTP matches
    if (otpData.otp == otp) {
      delete otpStore[email];
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully"
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }
  } catch (e) {
    console.log("Error verifying OTP: ", e);
    res.status(500).json({ success: false, message: `Could not verify OTP --> ${e}` });
  }
};
