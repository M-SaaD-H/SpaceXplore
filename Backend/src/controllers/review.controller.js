import { Destination } from "../models/destination.model.js";
import { Review } from "../models/review.model.js";
import { Tour } from "../models/tour.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"

const addReview = asyncHandler( async (req, res) => {
    const { destinationID, rating, content } = req.body;
    const userID = req.user?._id;

    if(!rating || !content) {
        throw new ApiError(404, "Review details not found");
    }

    const destination = await Destination.findById(destinationID);

    if(!destination) {
        throw new ApiError(404, "Destination doesn't exist");
    }

    const user = await User.findById(userID);

    if(!user) {
        throw new ApiError(400, "Login to post a review");
    }

    const completedTour = await Tour.findOne({
        user: userID,
        destination: destinationID,
        // status: "completed"
    });

    if(!completedTour) {
        throw new ApiError(400, "You can only review destinations you have completed a tour for");
    }

    const review = await Review.create({
        user: userID,
        destination: destinationID,
        rating,
        content
    });

    if(!review) {
        throw new ApiError(500, "Error while creating the review");
    }

    destination.reviews.push(review._id);

    await destination.save({ validateBeforeSave: false });

    if(!destination.reviews.includes(review._id)) {
        throw new ApiError(500, "Error while pushing created review in the destination's reviews");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, review, "Review posted successfully")
    )
});

export {
    addReview
}