import { asyncHandler } from "../utils/asyncHandler.js"
import { Tour } from "../models/tour.model.js"
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { Destination } from "../models/destination.model.js";


const bookATour = asyncHandler( async (req, res) => {
    const { destinationID } = req.body;
    const userID = req.user?._id;

    if(!destinationID) {
        throw new ApiError(400, "Destination id not fetched correctly");
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
        destination: destinationID
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


export {
    bookATour,
    cancelTour
}