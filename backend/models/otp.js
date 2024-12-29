import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            ref: "User"
        },
        otp:{
            type: Number,
            required: true,
        },
        timestamp:{
            type: Date,
            default: Date.now(),
            required: true,
            get: (timestamp) => timestamp.getTime(),
            set: (timestamp) => new Date(timestamp),
        }
    }
)

const Otp = mongoose.model("otp", otpSchema);
export default Otp;