import { Order } from "../../models/order.model.js";
import { ApiError } from "../apiError.js";
import { ApiResponse } from "../apiResponse.js";
import { asyncHandler } from "../asyncHandler.js";
import crypto from "crypto";

const verifyPayment = asyncHandler( async(req, res) => {
    const body = req.text();

    const signature = req.headers.get("x-razorpay-signature");

    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body.toString())
    .digest("hex");

    if(!signature !== expectedSignature) {
        throw new ApiError(400, "Invalid signature");
    }

    const event = JSON.parse(body);

    if(event.event === "payment.captured") {
        const payment = event.payload.payment.entity;

        const order = await Order.findOneAndUpdate(
            {
                razorpayOrderID: payment.order_id
            },
            {
                razorpayPaymentID: payment.id,
                status: "completed"
            }
        )
        .populate("user")
        .populate("destination");

        if(order) {
            // Send email to the user
        }
    }

    // Return the response

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Payment was successfully captured")
    )
});

export { verifyPayment }