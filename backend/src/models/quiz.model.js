import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctOption: { type: Number, required: true }, // Index of the correct option
    questionType: { type: String, enum: ["mcq", "true-false"], required: true },
});

const submissionSchema = new Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answers: [
        {
            question: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz.questions", required: true },
            selectedOption: { type: Number, required: true }, // Index of chosen option
            confidenceLevel: { type: Number, min: 1, max: 5, required: true },
        }
    ],
    score: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
});

const quizSchema = new Schema(
    {
        title: { type: String, required: true },
        classroom: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom", required: true },
        teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        questions: [questionSchema],
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        duration: { type: Number, required: true }, // Time in minutes
        submissions: [submissionSchema],
        status: { type: String, enum: ["active", "completed", "upcoming"], default: "upcoming" },
    },
    { timestamps: true }
);

export const Quiz = mongoose.model("Quiz", quizSchema);