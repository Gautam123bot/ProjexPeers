import bcrypt from 'bcryptjs';
import User from "../models/user.js"; 
import sgMail from "@sendgrid/mail";
import sendMailToUser from '../helper/mailer.js';

// Set the SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Register User Controller
export const registerUser = async (req, res) => {
  const {
    fullname,
    username,
    email,
    password,
    cpassword,
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

  if (!fullname || !username || !email || !password || !cpassword) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }

  try {
    const userSearchByEmail = await User.findOne({ email });
    const userSearchByUsername = await User.findOne({ username });

    if (userSearchByEmail || userSearchByUsername) {
      return res.status(422).json({ error: "User already exists." });
    }

    if (password !== cpassword) {
      return res.status(422).json({ error: "Passwords don't match." });
    }

    const user = new User({
      fullname,
      email,
      password,
      cpassword,
      username,
    });

    await user.save();    

    const msg = {
      to: email,
      from: "noreply@example.com",
      subject: "Welcome to our platform",
      text: `Hi ${fullname},\n\nThank you for registering!`,
    };
    // sgMail.send(msg);
    await sendMailToUser(req, res, email, "Welcome to our platform", msg.text);
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

    res.json({
      message: "Logged In Successfully!",
      token,
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error is coming as: ", error)
    res.status(500).json({ message: "Invalid login credentials" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // console.log(req.rootUser.tokens);

    req.rootUser.tokens = req.rootUser.tokens.filter((currElem) => currElem.token !== req.token);
    res.clearCookie("jwt", { path: "/" });

    await req.rootUser.save();

    return res.status(200).send({ message: "Logged out successfully!" });
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
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