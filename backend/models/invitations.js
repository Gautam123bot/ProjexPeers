import mongoose from "mongoose";

const InvitationSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true, match: /.+\@.+\..+/ },
    competitionType: { type: String, required: true },
    competitionName: { type: String, required: true },
    dateOfCompetition: { type: Date, required: false },
    durationOfCompetition: { type: Number, required: true },
    registrationDeadlineOfCompetition: { type: Date, required: true },
    currentTeamSize: { type: Number, required: true },
    projectOverview: { type: String, required: false },
    teamName: { type: String, required: false },
    message: { type: String, required: false },
    country: { type: String, required: false },
    state: { type: String, required: false },
    city: { type: String, required: false },
    location: { type: String, required: false },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Declined"],
        default: "Pending"
    },
    createdAt: { type: Date, default: Date.now },
});

const Invitation = mongoose.model("Invitation", InvitationSchema);

export default Invitation;
