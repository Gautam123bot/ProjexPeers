const Mongoose = require("mongoose");

const otpSchema = new Mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            ref: "user"
        },
        otp:{
            type: Date,
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

module.exports = mongoose.model("otp", otpSchema);