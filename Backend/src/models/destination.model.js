import mongoose, { Schema } from "mongoose";

const destinationSchema = new Schema(
    {
        name: {
            Type: String,
            required: true
        },
        description: {
            Type: String,
            required: true
        },
        image: {
            Type: String,
            required: true
        },
        price: {
            Type: Number,
            required: true
        },
        availableTickets: {
            Type: Number,
            default: 50,
            required: true
        },
        duration: {
            Type: String,
            required: true
        }
    }, { timestamps: true }
);

export const Destination = mongoose.model("Destination", destinationSchema);