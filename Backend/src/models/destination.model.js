import mongoose, { Schema } from "mongoose";

const destinationSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        availableTickets: {
            type: Number,
            default: 50,
            required: true
        },
        duration: {
            type: String,
            required: true
        }
    }, { timestamps: true }
);

export const Destination = mongoose.model("Destination", destinationSchema);