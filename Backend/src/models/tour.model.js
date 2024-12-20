import mongoose, { Schema } from "mongoose";

const tourSchema = new Schema(
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
        bookingDate: {
            type: Date,
            default: Date.now
        },
        travelDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            default: "upcoming",
            enum: ["upcoming", "completed", "cancelled"]
        },
        totalPrice: {
            type: Number,
            required: true
        }
    }, { timestamps: true }
);

export const Tour = mongoose.model("Tour", tourSchema);