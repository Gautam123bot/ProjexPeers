import express from "express";
import { createSpace, getUserSpaces, searchSpace, sendMessage } from "../controllers/spaceController.js";

const spaceRouter = express.Router();

spaceRouter.post("/create-space", createSpace);
spaceRouter.post("/get-users-spaces", getUserSpaces);
spaceRouter.post("/search-space", searchSpace);
spaceRouter.post("/send-message", sendMessage);

export default spaceRouter;
