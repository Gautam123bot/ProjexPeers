import express from "express";
import { sendOtp, verifyOtp } from "../controllers/otpController.js";
import { otpMailValidator } from "../middleware/validation.js";
import { validationResult } from "express-validator";

const otpRouter = express.Router();

otpRouter.post("/send-otp", otpMailValidator, sendOtp);
otpRouter.post("/verify-otp", verifyOtp);

export default otpRouter;
