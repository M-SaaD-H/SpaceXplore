import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"

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

const registerUser = asyncHandler( async (req, res) => {
    const { fullName, email, password } = req.body;
    const { firstName, lastName } = fullName;

    // Checks

    if(
        [firstName, lastName, email, password].some((field) => {
            field.trim() === "";
        })
    ) {
        throw new ApiError(400, "All fields are required");
    }

    if(!email.includes('@')) {
        throw new ApiError(400, "Please enter your email address");
    }

    const existingUser = await User.findOne({ email });

    if(existingUser) {
        throw new ApiError(400, "Email address already registered");
    }

    // Now register the user

    const user = await User.create({
        fullName,
        email,
        password
    });

    if(!user) {
        throw new ApiError(500, "Error occured while registering the user");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(400, user, "User Registered successfully")
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

    const { accessToken, refreshToken } = generateAccessAndRefreshToken(user._id);

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

export {
    registerUser,
    loginUser
}