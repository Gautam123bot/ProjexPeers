import bcrypt from 'bcryptjs';
import User from "../models/user.js"; 
import sgMail from "@sendgrid/mail";
import sendMailToUser from '../helper/mailer.js';

const otpStore = {};

const generateRandom6Digit = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// Set the SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Register User Controller
export const registerUser = async (req, res) => {
  const {
    fullname,
    username,
    email,
    password,
    institution,
    profilePic,
    collegeStream,
    collegeYear,
    linkedIn,
    github,
    experience,
    skills,
    achievements,
  } = req.body;

  if (!fullname || !username || !email || !password) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }

  try {
    const userSearchByEmail = await User.findOne({ email });
    const userSearchByUsername = await User.findOne({ username });

    if (userSearchByEmail || userSearchByUsername) {
      return res.status(422).json({ error: "User already exists." });
    }

    const user = new User({
      fullname,
      email,
      password,
      username,
    });

    await user.save();    

    // const msg = {
    //   to: email,
    //   from: "noreply@example.com",
    //   subject: "Welcome to our platform",
    //   text: `Hi ${fullname},\n\nThank you for registering!`,
    // };
    const msg = `
      <p>Hi <b>${fullname}</b>,</p>
      <p>Thank you for registering on our platform. We're excited to have you onboard!</p>
      <br>
      <p>Regards,<br>Team ProjexPeers</p>
    `;
    // sgMail.send(msg);
    const info = await sendMailToUser(email, "Welcome to our platform!", msg);

    // Check if the info variable is empty or contains any error information
    if (!info.success) {
      // Handle the error case where the email wasn't sent successfully
      return res.status(500).json({
        message: "Failed to send OTP. Please try again later.",
        success: false,
      });
    }
    res.status(201).json({ message: "Registered Successfully!", success: true });
  } catch (e) {
    res.status(500).json({ message: `Could not create account! --> ${e}`, success: false });
  }
};

// Login User Controller
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User doesn't exist with this email" });
    }

    const passCheck = await bcrypt.compare(password, user.password);
    console.log("password from frontend is: ", password)
    console.log("original password from db is: ", user.password)

    if (!passCheck) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const token = await user.generateAuthToken()
    console.log("Generated token is: ", token);

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      message: "Logged In Successfully!",
      token,
      success: true,
      username: user.username,
      user,
    });
  } catch (error) {
    console.log("Error is coming as: ", error)
    return res.status(500).json({ message: "Invalid login credentials" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // console.log(req.rootUser.tokens);

    req.rootUser.tokens = req.rootUser.tokens.filter((currElem) => currElem.token !== req.token);
    res.clearCookie("jwt", { path: "/" });

    // await req.rootUser.save();

    return res.status(200).send({ message: "Logged out successfully!" });
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(422).json({ error: "Please provide an email." });
  }

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const otp = generateRandom6Digit();
    otpStore[email] = {
      otp,
      createdAt: Date.now(),
    };
    console.log("otp store data is: ", otpStore)

    const msg = `<p>Hi <b>${email}</b>,</p><p>Your OTP for resetting the password is: <b>${otp}</b></p><br><p>Regards,<br>ProjexPeers Team</p>`;
    const info = await sendMailToUser(email, "Password Reset OTP", msg);
    if (!info.success) {
      return res.status(500).json({
        message: "Failed to send OTP. Please try again later.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "OTP sent to your email address.",
      success: true,
    });
  } catch (e) {
    console.log("Error occurred while sending OTP:", e);
    res.status(500).json({ message: `Could notT send OTP: ${e}`, success: false });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;

  if (!email || !otp || !newPassword || !confirmPassword) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }

  try {
    const otpData = otpStore[email];
    console.log("otp data is: ", otpData);
    if (!otpData) {
      return res.status(400).json({ message: "OTP not found for this email" });
    }
    console.log("otp store is: ", otpStore);

    const expirationTime = 10 * 60 * 1000;
    if (Date.now() - otpData.createdAt > expirationTime) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP has expired" });
    }
    console.log("otp data is: ", otpData.otp, "otp is: ", otp);
    if (otpData.otp != otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(422).json({ message: "Passwords don't match" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    delete otpStore[email];

    return res.status(200).json({
      message: "Password reset successfully!",
      success: true,
      user,
    });
  } catch (e) {
    console.log("Error occurred during password reset:", e);
    res.status(500).json({ message: `Could not reset password: ${e}`, success: false });
  }
};

export const loginWithGoogle = async (req, res) => {
  const { email: logEmail } = req.body;

  if (!logEmail) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }

  try {
    const user = await User.findOne({ email: logEmail });

    if (!user) {
      return res.status(400).json({ message: "Invalid login credentials" });
    }

    const token = await user.generateAuthToken();

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    });

    return res.status(200).json({
      message: "Logged In Successfully!",
      token,
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Invalid login credentials" });
  }
};