import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        destination: {
            Type: Schema.Types.ObjectId,
            ref: "Destination",
            required: true
        },
        bookingDate: {
            Type: Date,
            default: Date.now
        },
        travelDate: {
            Type: Date,
            required: true
        },
        status: {
            type: String,
            default: "upcoming",
            enum: ["upcoming", "completed", "cancelled"]
        },
        totalPrice: {
            Type: Number,
            required: true
        }
    }, { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);