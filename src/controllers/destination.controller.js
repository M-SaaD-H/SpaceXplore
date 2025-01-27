import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Destination } from "../models/destination.model.js";

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
});

const getDestinationById = asyncHandler( async (req, res) => {
    const { destinationID } = req.params;
    
    const destination = await Destination.findById(destinationID).populate("reviews");

    if(!destination) {
        throw new ApiError(404, "Destination not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, destination, "Destination fetched successfully")
    )
});

const getAllDestinationReviews = asyncHandler( async (req, res) => {
    const { destinationID } = req.params;

    const destination = await Destination.findById(destinationID).populate("reviews");

    if(!destination) {
        throw new ApiError(404, "Destination not found");
    }

    if(!destination.reviews || destination.reviews.length === 0) {
        throw new ApiError(400, "No reviews for the destination");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, destination.reviews, "Reviews for the destination fetched successfully")
    )
});


export {
    getAllAvailableDestinations,
    getDestinationById,
    getAllDestinationReviews
}