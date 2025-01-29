import { asyncHandler } from "../utils/asyncHandler.js"
import { Tour } from "../models/tour.model.js"
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { Destination } from "../models/destination.model.js";
import { sendBookingCancellationEmail, sendBookingComfirmationEmail } from "../utils/nodemailer.js";
import { razorpay } from "../utils/razorpay/razorpay.js";
import { Order } from "../models/order.model.js";
import crypto from "crypto";


const createOrder = asyncHandler( async (req, res) => {
    const { destinationID } = req.body;
    const userID = req.user?._id;

    if(!userID) {
        throw new ApiError(401, "Unauthorized request");
    }

    const user = await User.findById(userID);

    if(!destinationID) {
        throw new ApiError(400, "Destination id not fetched correctly");
    }

    const destination = await Destination.findById(destinationID);

    if(!destination) {
        throw new ApiError(404, "Destination is not available");
    }

    if(destination.availableTickets <= 0) {
        throw new ApiError(401, "No available tickets for this destination");
    }

    // Create razorpay order

    const order = await razorpay.orders.create({
        amount: destination.price * 100,
        currency: "INR",
        receipt: `receipt-${Date.now()}`,
        notes: {
            destinationID
        }
    });

    // The above is the order for razorpay
    // We have to create one to store in our database too

    const newOrder = await Order.create({
        user,
        destination,
        razorpayOrderID: order.id,
        amount: ((destination.price*10000000) + 100000 + (0.18*10000000*destination.price)) * 100,
        status: "pending"
    });

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                orderID: order.id,
                amount: order.amount,
                currency: order.currency,
                dbOrderID: newOrder._id
            },
            "Order created successfully"
        )
    )
});

const verifyPaymentAndCreateTour = asyncHandler( async (req, res) => {
    const { destinationID, razorpayOrderID, razorpayPaymentID, razorpaySignature } = req.body;
    const userID = req.user?._id;

    if(!destinationID || !razorpayOrderID || !razorpayPaymentID || !razorpaySignature) {
        throw new ApiError(404, "All fields are required");
    }

    const destination = await Destination.findById(destinationID);
    
    if(!destination) {
        throw new ApiError(404, "Destination not found");
    }
    
    if(destination.availableTickets <= 0) {
        throw new ApiError(401, "No available tickets for this destination");
    }
    
    // Verify payment
    
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderID}|${razorpayPaymentID}`)
    .digest("hex");
    
    if(razorpaySignature !== expectedSignature) {
        throw new ApiError(400, "Invalid signature");
    }
        
    // Now proceed to book the tour
        
    destination.availableTickets = destination.availableTickets - 1;
    
    await destination.save({ validateBeforeSave: false });
        
    const tour = await Tour.create({
        user: userID,
        destination: destinationID
    });

    if(!tour) {
        throw new ApiError(500, "Error while creating a tour");
    }

    const user = await User.findByIdAndUpdate(
        userID,
        {
            $push: {
                tours: tour
            }
        }
    )

    sendBookingComfirmationEmail(user.fullName.firstName, await tour.populate("destination"), user.email);

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

    await Destination.findByIdAndUpdate(
        tour.destination,
        {
            $inc: {
                availableTickets: 1
            }
        },
        {
            new: true
        }
    )

    await tour.deleteOne();

    // if(await Tour.findById(tourID)) {
    //     throw new ApiError(500, "Error while deleting the tour");
    // }

    sendBookingCancellationEmail(user.fullName.firstName, await tour.populate("destination"), user.email);

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Tour cancelled successfully")
    )
})


export {
    createOrder,
    verifyPaymentAndCreateTour,
    cancelTour
}