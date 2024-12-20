import { asyncHandler } from "../utils/asyncHandler.js"
import { Tour } from "../models/tour.model.js"
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";

const bookATour = asyncHandler( async (req, res) => {
    const { destination, travelDate, bookingDate, totalPrice } = req.body;
    const userID = req.user?._id;

    if(
        [destination, travelDate, totalPrice].some((field) => {
            field === ""
        })
    ) {
        throw new ApiError(400, "Tour details are not fetched correctly");
    }

    if(!userID) {
        throw new ApiError(401, "Unauthorized request");
    }

    const tour = await Tour.create({
        user: userID,
        destination, 
        bookingDate: new Date(bookingDate) || Date.now(),
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

export {
    bookATour
}