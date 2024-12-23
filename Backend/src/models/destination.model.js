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
        travelDate: {
            type: Date,
            required: true
        },
        availableTickets: {
            type: Number,
            default: 50,
            required: true
        },
        duration: {
            type: Number, // This duration will be in days
            required: true
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review"
            }
        ]
    }
);

export const Destination = mongoose.model("Destination", destinationSchema);