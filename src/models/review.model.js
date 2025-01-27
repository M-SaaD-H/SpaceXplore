import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
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
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        content: {
            type: String,
            required: true
        }
    }, { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);