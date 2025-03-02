import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        fullname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        userType: {
            type: String,
            enum : ["teacher", "student"],
            required: true
        },
        refreshToken: {
            type: String,
        }
    }, 
    { 
        timestamps: true 
    }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Check if entered password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate JWT Access Token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { 
            _id: this._id, 
            email: this.email, 
            userType: this.userType 
        },
        "garvit123",
        { 
            expiresIn: "1d"
        } // Adjust expiration time as needed
    );
};

// Generate JWT Refresh Token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { 
            _id: this._id, 
            email: this.email, 
            userType: this.userType 
        },
        "garvit123",
        { 
            expiresIn: "1d" 
        }
    );
};

export const User = mongoose.model("User", userSchema);