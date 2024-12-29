import sgMail from "@sendgrid/mail";

export const sendEmail = async (req, res) => {
  const { email, name } = req.body;
  const msg = {
    to: email,
    from: "0101gautamkumar@gmail.com",
    subject: "New Notification from ProjexPeers",
    text: `${name} wants to connect with you!`,
  };
  try {
    await sgMail.send(msg);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (e) {
    res.status(500).json({ message: `Could not send email --> ${e}` });
  }
};
