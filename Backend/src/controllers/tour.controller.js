import { asyncHandler } from "../utils/asyncHandler.js"
import { Tour } from "../models/tour.model.js"
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { Destination } from "../models/destination.model.js";
import { query } from "express";

const bookATour = asyncHandler( async (req, res) => {
    const { destinationID, travelDate, totalPrice } = req.body;
    const userID = req.user?._id;

    if(
        [destinationID, travelDate, totalPrice].some((field) => {
            field === ""
        })
    ) {
        throw new ApiError(400, "Tour details are not fetched correctly");
    }

    const destination = await Destination.findById(destinationID);

    if(!destination) {
        throw new ApiError(404, "Destination is not available");
    }

    if(!userID) {
        throw new ApiError(401, "Unauthorized request");
    }

    const tour = await Tour.create({
        user: userID,
        destination: destinationID,
        travelDate: new Date(travelDate),
        totalPrice
    });

    if(!tour) {
        throw new ApiError(500, "Error while creating a tour");
    }

    await User.findByIdAndUpdate(
        userID,
        {
            $push: {
                tours: tour
            }
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, tour, "Tour created successfully")
    )
});

const cancelTour = asyncHandler( async (req, res) => {
    const { tourID } = req.body;
    const userID = req.user._id;

    if(!tourID || !userID) {
        throw new ApiError(400, "tour id or user id not found");
    }
    
    const tour = await Tour.findById(tourID);

    if(!tour) {
        throw new ApiError(400, "tour not found");
    }

    const user = await User.findById(userID);

    if(!user) {
        throw new ApiError(404, "Unauthorized request");
    }

    if(!user.tours.includes(tourID)) {
        throw new ApiError(400, "You have not booked this tour");
    }

    user.tours.pull(tourID);
    await user.save({ validateBeforeSave: false });

    if(user.tours.includes(tourID)) {
        throw new ApiError(400, "Error in cancelling the tour");
    }

    await tour.deleteOne();

    if(await Tour.findById(tourID)) {
        throw new ApiError(500, "Error while deleting the tour");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Tour cancelled successfully")
    )
})

const getAllAvailableDestinations = asyncHandler( async (req, res) => {
    const { minPrice, maxPrice, maxDuration } = req.query;

    const query = {}

    if(minPrice) query.price = { ...query.price, $gte: minPrice }
    if(maxPrice) query.price = { ...query.price, $lte: maxPrice }
    if(maxDuration) query.duration = { ...query.duration, $lte: maxDuration }  // This '...' is the spread operator which is used to add fields in an object

    const destinations = await Destination.find(query).lean();

    if(!destinations || destinations.length === 0) {
        throw new ApiError(404, "No available destination")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, destinations, "Available destinations fetched successfully")
    )
})

export {
    bookATour,
    cancelTour,
    getAllAvailableDestinations
}