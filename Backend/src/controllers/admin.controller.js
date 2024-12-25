import { User } from "../models/user.model.js";
import { Destination } from "../models/destination.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const addDestination = asyncHandler( async (req, res) => {
    const { name, description, image, price, travelDate, availableTickets, duration } = req.body
    const userID = req.user?._id;

    const user = await User.findById(userID);

    if(!user) {
        throw new ApiError(404, "User not found");
    }

    if(!user.isAdmin) {
        throw new ApiError(401, "Unauthorized request, only admins can add destinations");
    }

    if(
        [name, description, image, price, travelDate, availableTickets, duration].some((field) => {
            field === ""
        })
    ) {
        throw new ApiError(401, "All fields are required");
    }


    const existingDestination = await Destination.findOne({ name });

    if(existingDestination) {
        throw new ApiError(400, "Destination already exists");
    }

    const destination = await Destination.create({
        name,
        description,
        image,
        price,
        travelDate,
        availableTickets,
        duration
    });

    if(!destination) {
        throw new ApiError(500, "Error in adding adding destination");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, destination, "Destination added successfully")
    )
});

const deleteDestination = asyncHandler( async (req, res) => {
    const { destinationID } = req.body;
    const userID = req.user?._id;

    const user = await User.findById(userID);
    
    if(!user) {
        throw new ApiError(404, "User not found");
    }

    if(!user.isAdmin) {
        throw new ApiError(401, "Unauthorized request, only admins can delete destinations");
    }

    if(!destinationID) {
        throw new ApiError(401, "Destintaion ID not found");
    }

    const destination = await Destination.findById(destinationID);

    if(!destination) {
        throw new ApiError(404, "Destination not found");
    }

    await destination.deleteOne();

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Destination deleted successfully")
    )
});

export {
    addDestination,
    deleteDestination
}