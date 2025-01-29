import express from "express";
import { createContactMessage } from "../controllers/contactusController.js";

const contactusRouter = express.Router();

contactusRouter.post("/contact-us", createContactMessage);

export default contactusRouter;
