import { type } from "express/lib/response";
import mongoose, { Schema } from "mongoose";

const proctoringSchema = new Schema(
    {
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true        
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true        
        },
        tabSwitchCount: {
            type: Number,
            default: 0
        },
        lastDetected: {
            type: Date,
        }
    }
);

export const Proctoring = mongoose.model("Proctoring", proctoringSchema);