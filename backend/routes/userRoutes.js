import express from "express";
import { updateUser, getUser } from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.patch("/updateUser/:id", updateUser);
userRouter.post("/getUser", getUser);

export default userRouter;
