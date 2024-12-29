import Otp from "../models/otp.js";
import sendMailToUser from "../helper/mailer.js";

const generateRandom4Digit = async() => {
    return Math.floor(1000 + Math.random() * 9000);
}

// Controller for sending OTP
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
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
    const generatedOtp = await generateRandom4Digit();
    console.log("Generated OTP: ", generatedOtp);

    // Save OTP in the database
    const otpEntry = new Otp({
      email: email,
      otp: generatedOtp
    });
    await otpEntry.save();

    // Prepare email message and send OTP to the user
    const msg = `<p> Hi <b>${email}</b>, </p><br><p> Your OTP for ProjexPeers is: ${generatedOtp} </p><br><p> Regards, <br> ProjexPeers Team </p>`;
    await sendMailToUser(req, res, email, "OTP for ProjexPeers", msg);
  } catch (e) {
    console.log("Could not find user --> ", e);
    res.status(500).json({ success: false, message: `Could not send OTP --> ${e}` });
  }
};

// Controller for verifying OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log("Entered email: ", email, "Entered OTP: ", otp);

    // Find the OTP entry for the provided email
    const otpData = await Otp.findOne({ email: email });
    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "OTP not found for this email"
      });
    }

    // Check if the OTP matches
    if (otpData.otp === otp) {
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
