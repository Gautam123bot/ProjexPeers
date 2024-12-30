import { check } from "express-validator";

export const otpMailValidator = [
    check("email", "please enter a valid email").isEmail().normalizeEmail({
        gmail_remove_dots: false,
    }),
];
