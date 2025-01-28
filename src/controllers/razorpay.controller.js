import { razorpay } from "../utils/razorpay/razorpay.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse} from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { Destination } from "../models/destination.model.js";
import { Order } from "../models/order.model.js";

const createOrder = asyncHandler( async(req, res) => {
    const { destinationID } = req.body;
    const userID = req.user._id;

    if(!userID) {
        throw new ApiError(404, "Unauthorized request");
    }

    if(!destinationID) {
        throw new ApiError(404, "All fields are required");
    }

    const user = await User.findById(userID);

    if(!user) {
        throw new ApiError(404, "User not found");
    }

    const destination = await Destination.findById(destinationID);

    if(!destination) {
        throw new ApiError(404, "Destination not found");
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
        amount: (destination.price + 100000 + (0.18*destination.price)) * 100,
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

export { createOrder };