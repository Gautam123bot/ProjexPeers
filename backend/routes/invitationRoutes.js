import express from "express";
import { sendInvitation, getInvitation, updateInvitationStatus, getInvitationStatus } from "../controllers/invitationController.js";

const invitationRouter = express.Router();

invitationRouter.post("/send-invite", sendInvitation);
invitationRouter.get("/get-invite", getInvitation);
invitationRouter.patch("/update-inviteStatus/:id", updateInvitationStatus);
invitationRouter.get("/get-invite-status", getInvitationStatus);

export default invitationRouter;
