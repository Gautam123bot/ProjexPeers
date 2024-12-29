import express from "express";
import { sendEmail } from "../controllers/emailController.js";

const emailRouter = express.Router();

emailRouter.post("/send-email", sendEmail);

export default emailRouter;
