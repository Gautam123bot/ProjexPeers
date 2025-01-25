import Invitation from "../models/invitations.js";

export const sendInvitation = async (req, res) => {
  try {
    const { senderId, recipientId, senderName, senderEmail, competitionType, competitionName, dateOfCompetition, durationOfCompetition, registrationDeadlineOfCompetition, currentTeamSize, projectOverview, teamName, message, country, state, city, location } = req.body;

    const invitation = new Invitation({
      senderId,
      recipientId,
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

    res.status(201).json({ message: "Invitation sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send invitation.", details: err.message });
  }
};


export const getInvitation = async (req, res) => {
  try {
    const { recipientId } = req.query;
    const invitations = await Invitation.find({ recipientId, status: "Pending" });
    res.status(200).json(invitations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch invitations." });
  }
};

// PATCH /api/invitations/:id
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

    res.status(200).json({ message: "Invitation status updated.", invitation: invitation });
  } catch (err) {
    res.status(500).json({ error: "Failed to update invitation status." });
  }
};

export const getInvitationStatus = async (req, res) => {
  try {
    const { senderId, recipientId } = req.query;
    const invitation = await Invitation.findOne({ senderId, recipientId });

    if (invitation) {
      return res.status(200).json(invitation);
    }

    res.status(404).json({ error: "No invitation found." });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch invitation status." });
  }
};
