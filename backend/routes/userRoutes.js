import express from "express";
import { updateUser, getUser, getUserByUsername } from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.patch("/updateUser/:id", updateUser);
userRouter.post("/getUser", getUser);
userRouter.get("/getUser/:username", getUserByUsername);

export default userRouter;
