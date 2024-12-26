import mongoose, { Schema } from "mongoose";

const otpVerification = new Schema(
    {
        usersEmail: {
            type: String,
            required: true
        },
        OTP: {
            type: Number,
            required: true
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expireAfterSeconds: 5 * 60 }
        }
    }, { timestamps: true }
);


export const OTPVerification = mongoose.model("OTPVerification", otpVerification);