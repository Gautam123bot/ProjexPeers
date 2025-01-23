import mongoose from "mongoose";

const InvitationSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    teamName: { type: String, required: true },
    competition: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Accepted", "Declined"], default: "Pending" },
    createdAt: { type: Date, default: Date.now },
});

const Invitation = mongoose.model("Invitations", InvitationSchema);

export default Invitation;