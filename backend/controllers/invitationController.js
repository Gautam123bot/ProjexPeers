import Invitation from "../models/invitations.js";
import User from "../models/user.js";

export const sendInvitation = async (req, res) => {
  try {
    const { senderUserName, recipientUserName, senderName, senderEmail, competitionType, competitionName, dateOfCompetition, durationOfCompetition, registrationDeadlineOfCompetition, currentTeamSize, projectOverview, teamName, message, country, state, city, location } = req.body;

    const invitation = new Invitation({
      senderUserName,
      recipientUserName,
      senderName,
      senderEmail,
      competitionType,
      competitionName,
      dateOfCompetition,
      durationOfCompetition,
      registrationDeadlineOfCompetition,
      currentTeamSize,
      projectOverview,
      teamName,
      message,
      country,
      state,
      city,
      location,
      status: "Pending",
    });

    await invitation.save();
    global.io?.emit('invite:sent', { senderUserName, recipientUserName });

    res.status(201).json({ message: "Invitation sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send invitation.", details: err.message });
  }
};


export const getInvitation = async (req, res) => {
  try {
    const { recipientUserName } = req.query;
    const invitations = await Invitation.find({ recipientUserName, status: "Pending" });
    res.status(200).json(invitations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch invitations.", details: err.message });
  }
};

export const updateInvitationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const invitation = await Invitation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!invitation) {
      return res.status(404).json({ error: "Invitation not found." });
    }

    const { senderUserName, recipientUserName } = invitation;

    if (status === "Accepted") {
      global.io.emit("invite:accepted", { senderUserName, recipientUserName });
      await User.findByIdAndUpdate(
        invitation.senderUserName,
        { $addToSet: { friendList: invitation.recipientUserName } },
        { new: true }
      );

      await User.findByIdAndUpdate(
        invitation.recipientUserName,
        { $addToSet: { friendList: invitation.senderUserName } },
        { new: true }
      );
    }
    else {
      global.io.emit('invite:declined', { senderUserName, recipientUserName });
    }
    return res.status(200).json({ message: 'Invitation status updated.', invitation: invitation });

  } catch (err) {
    res.status(500).json({ error: "Failed to update invitation status.", err: err.message });
  }
};

export const getInvitationStatus = async (req, res) => {
  try {
    const { senderUserName, recipientUserName } = req.query;
    const invitation = await Invitation.findOne({ senderUserName, recipientUserName });

    if (invitation) {
      return res.status(200).json(invitation);
    }

    res.status(404).json({ error: "No invitation found." });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch invitation status." });
  }
};
