import mongoose, { Schema } from "mongoose";

const classroomSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ""
        },
        teacher: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        students: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [] 
        }],
        quizzes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            default: [] 
        }],
        classCode: { 
            type: String,
            required: true,
            unique: true,
            index: true // Ensures uniqueness at the database level
        }
    }, 
    { 
        timestamps: true 
    }
);

export const Classroom = mongoose.model("Classroom", classroomSchema);
