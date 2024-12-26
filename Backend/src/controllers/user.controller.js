import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { sendOTPEmail, sendWelcomeEmail } from "../utils/nodemailer.js"
import { OTPVerification } from "../models/otpVerification.model.js"

// options for cookies
const options = {
    httpOnly: true,
    secure: true
}

const generateAccessAndRefreshToken = async (userID) => {
    try {
        const user = await User.findById(userID);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error while generating access and refresh token");
    }
}

const generateAndSendOTP = asyncHandler( async (fullName, email) => {
    const OTP = Math.floor(100000 + Math.random() * 900000);

    await OTPVerification.create({
        usersEmail: email,
        OTP,
        expiresAt: Date.now() + 5 * 60 * 1000 // OTP expires in 5 minutes
    });

    sendOTPEmail(fullName.firstName + " " + fullName.lastName, OTP, email);
})

const registerUser = asyncHandler( async (req, res) => {
    const { fullName, email, password, isAdmin } = req.body;
    const { firstName, lastName } = fullName;

    // Checks

    if(
        [firstName, lastName, email, password, isAdmin].some((field) => {
            field === "";
        })
    ) {
        throw new ApiError(400, "All fields are required");
    }

    if(!email.includes('@')) {
        throw new ApiError(400, "Email Address is invalid");
    }

    const existingUser = await User.findOne({ email });

    if(existingUser) {
        throw new ApiError(400, "Email address already registered");
    }

    generateAndSendOTP(fullName, email)

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "OTP sent successfully")
    )
});

const verifyOtpAndLoginUser = asyncHandler( async (req, res) => {
    const { fullName, email, password, isAdmin, OTP } = req.body;

    if(
        [email, OTP, fullName.firstName, fullName.lastName, password, isAdmin].some((field) => {
            field === ""
        })
    ) {
        throw new ApiError(400, "All fields are required");
    }
    
    if(!email.includes('@')) {
        throw new ApiError(400, "Email Address is invalid");
    }

    const storedOtpVerificationInstance = await OTPVerification.findOne({ usersEmail: email });

    if(!storedOtpVerificationInstance) {
        throw new ApiError(404, "OTP has not been requested or already verified");
    }

    if(storedOtpVerificationInstance.expiresAt < Date.now()) {
        throw new ApiError(400, "OTP is expired");
    }

    if(OTP !== storedOtpVerificationInstance.OTP) {
        throw new ApiError(400, "Invalid OTP");
    }

    await storedOtpVerificationInstance.deleteOne();

    // Now create the user

    const user = await User.create({
        fullName,
        email,
        password,
        isAdmin
    });

    if(!user) {
        throw new ApiError(500, "Error occured while registering the user");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    
    sendWelcomeEmail(fullName.firstName + " " + fullName.lastName, user.email);

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user,
                accessToken,
                refreshToken
            },
            "User created and logged in successfully"
        )
    )
});

const resendOTP = asyncHandler( async (req, res) => {
    const { fullName, email } = req.body;

    if(!fullName || !email) {
        throw new ApiError(400, "All fields are required");
    }

    generateAndSendOTP(fullName, email);

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "OTP resent successfully")
    )
});

const loginUser = asyncHandler( async (req, res) => {
    const { email, password} = req.body;

    if(!email.trim() || !password.trim()) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ email }).select("+password");

    if(!user) {
        throw new ApiError(404, "User does not exits");
    }

    if(!await user.isPasswordCorrect(password, user.password)) {
        throw new ApiError(401, "Password is invalid");
    }

    const { accessToken, refreshToken } =  await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id);

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in successfully"
        )
    )
});

const logoutUser = asyncHandler( async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        }
    )

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User logged out Successfully")
    )
});

const refreshAccessToken = asyncHandler( async (req, res) => {
    const userRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!userRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }
    
    try {
        const decodedToken = jwt.verify(userRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        const user = await User.findById(decodedToken._id);
        
        if(!user) {
            throw new ApiError(401, "Unauthorized request");
        }
        
        if(userRefreshToken !== user.refreshAccessToken) {
            throw new ApiError(401, "Refresh Token is expired or used");
        }
    
        const newTokens = await generateAccessAndRefreshToken();
    
        return res
        .status(200)
        .cookie("accessToken", newTokens.accessToken, options)
        .cookie("refreshToken", newTokens.refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken: newTokens.accessToken,
                    refreshToken: newTokens.refreshToken
                },
                "Access Token refreshed successfully"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token");
    }
});

const getCurrentUser = asyncHandler( async (req, res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(200, req.user, "Current user fetched successfully")
    )
})

const changeCurrentPassword = asyncHandler( async (req, res) => {
    const { oldPassword, confirmOldPassword, newPassword } = req.body;

    if(oldPassword !== confirmOldPassword) {
        throw new ApiError(400, "Old password and confirm old password does not match");
    }

    const user = await User.findById(req.user?._id).select("+password");

    if(!user) {
        throw new ApiError(400, "User does not exist");
    }

    if(!await user.isPasswordCorrect(oldPassword, user.password)) {
        throw new ApiError(400, "Old password is invalid");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Password changes successfully")
    )
})

const getAllUserTours = asyncHandler( async (req, res) => {
    const userID = req.user?._id;

    const user = await User.findById(userID).populate("tours");

    const userTours = user.tours;

    for(let i=0; i<userTours.length; i++) {
        await userTours[i].populate("destination");
    }

    if(!user) {
        throw new ApiError(404, "User not found");
    }

    if(!user.tours || !user.tours.length === 0) {
        throw new ApiError(400, "No tour found for the user");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, userTours, "All tours of the user fetched successfully")
    )
})

export {
    registerUser,
    verifyOtpAndLoginUser,
    resendOTP,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    changeCurrentPassword,
    getAllUserTours
}