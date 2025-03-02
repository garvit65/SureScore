import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        console.log("🔹 Generating tokens for user:", userId);

        const user = await User.findById(userId);
        if (!user) {
            console.error("User not found for token generation:", userId);
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        console.log("Tokens generated successfully for user:", userId);
        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Token Generation Error:", error);
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};



const registerUser  = asyncHandler(async (req, res) => {
    
    const { fullname, email, password, userType } = req.body;
    
    if (
        [fullname, email, password, userType].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }
    
    const existedUser = await User.findOne({
        $or: [{ email }]
    });
    
    if(existedUser) {
        throw new ApiError(409, "User with email already exists")
    }

    const user = await User.create({
        fullname,
        email,
        password,
        userType
    });
    
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    );
});


const loginUser = asyncHandler(async (req, res) => {
    try {
        console.log("➡️ Login request received:", req.body); // Log request data

        const { email, password } = req.body;

        if (!email || !password) {
            console.error("Missing email or password");
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.error("User not found:", email);
            return res.status(404).json({ message: "User does not exist" });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            console.error("Invalid credentials for:", email);
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
        console.log("Tokens generated successfully for:", email);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json({
                user: loggedInUser,
                accessToken,
                refreshToken,
                message: "User logged in successfully",
            });

    } catch (error) {
        console.error("Backend Login Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});



const logoutUser = asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Unauthorized request");
    }

    // Remove refreshToken from database
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: "" } }, // Properly removes the field
        { new: true }
    );

    // Cookie options for clearing tokens
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        // Generate new access and refresh tokens
        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

        // Update user with new refresh token
        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        // Secure cookie options
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed"));
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Both old and new passwords are required");
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    user.refreshToken = null; // Invalidate all sessions after password change
    await user.save({ validateBeforeSave: false });

    // Securely clear authentication cookies
    const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict" };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Password changed successfully. Please log in again."));
});


const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body;

    if (!fullname || !email) {
        throw new ApiError(400, "Full name and email are required");
    }

    // Check if email is already in use by another user
    const existingUser = await User.findOne({ email: email.toLowerCase(), _id: { $ne: req.user._id } });
    if (existingUser) {
        throw new ApiError(400, "Email is already in use by another account");
    }

    // Update user info
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { fullname, email: email.toLowerCase() } },
        { new: true, runValidators: true } // Ensures email format is valid
    ).select("-password -refreshToken");
    
    if (!user) {
        throw new ApiError(404, "User not found"); // Handle case where user doesn't exist
    }
    
    return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
    
});





export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails,
}



export default generateAccessAndRefreshTokens;