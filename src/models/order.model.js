import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        destination: {
            type: Schema.Types.ObjectId,
            ref: "Destination",
            required: true
        },
        amount: {
            type: Number, // This amount will be the amount that the user have to pay (i.e. destination price + platform fee + taxes)
            required: true
        },
        razorpayOrderID: {
            type: String,
            required: true
        },
        razorpayPaymentID: {
            type: String,
        },
        status: {
            type: String,
            rquired: true,
            enum: ["pending", "completed", "failed"],
            default: "pending"
        }
    }, { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);