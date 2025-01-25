import express from "express";
import { getNotification } from "../controllers/notificationController.js"; // Import the controller

const notificationRouter = express.Router();

notificationRouter.post("/get-notifications", getNotification);

export default notificationRouter;
