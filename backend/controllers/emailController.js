import sgMail from "@sendgrid/mail";
import sendMailToUser from "../helper/mailer";

export const sendEmail = async (req, res) => {
  // const { email, name } = req.body;
  // const msg = {
  //   to: email,
  //   from: "0101gautamkumar@gmail.com",
  //   subject: "New Notification from ProjexPeers",
  //   text: `${name} wants to connect with you!`,
  // };
  // try {
  //   await sgMail.send(msg);
  //   res.status(200).json({ message: "Email sent successfully!" });
  // } catch (e) {
  //   res.status(500).json({ message: `Could not send email --> ${e}` });
  // }

  try {
    const { email, name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required, Please get login if you are not!",
      });
    }
    console.log("Entered email is: ", email);
    const msg = {
      to: email,
      from: "0101gautamkumar@gmail.com",
      subject: "New Notification from ProjexPeers",
      text: `${name} wants to connect with you!`,
    };

    // Check if the email is already registered
    const userData = await User.findOne({ email: email });
    if (userData) {
      return res.status(400).json({
        success: false,
        message: "Email already exists!",
      });
    }

    await sendMailToUser(req, res, email, msg.subject, msg.text);
  } catch (e) {
    console.log("Could not find user --> ", e);
    res
      .status(500)
      .json({ success: false, message: `Could not send OTP --> ${e}` });
  }
};
