import mongoose, { Schema } from "mongoose";

const analysisSchema = new Schema(
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
        score: {
            type: Number,
            required: true
        },
        confidenceAnalysis: [{       
            question: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Question", 
                required: true 
            },
            studentAttempt: { 
                type: String, 
                required: true 
            }, // The answer student selected
            correctAnswer: { 
                type: String, 
                required: true 
            }, // The correct answer
            confidenceLevel: { 
                type: Number, 
                required: true 
            }, // Confidence marked by student
            correctness: { 
                type: Boolean,
                required: true 
            }, // Whether student was right or wrong
            topic: { 
                type: String, 
                required: true 
            } // The topic of the question
        }],
        generatedAt: { 
            type: Date, 
            default: Date.now 
        }
    }, 
    { 
        timestamps: true 
    }
);

export const Analysis = mongoose.model("Analysis", analysisSchema);