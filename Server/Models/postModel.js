import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        userId: { type: String, required: true },
        desc: String,
        likes: [],
        image: String,
        
        // Fitness-specific fields
        postType: {
            type: String,
            enum: ['workout', 'progress', 'motivation', 'achievement', 'general'],
            default: 'general'
        },
        
        // For workout posts
        workoutId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workouts'
        },
        
        // For progress posts
        progressData: {
            bodyWeight: Number,
            bodyFat: Number,
            measurements: {
                chest: Number,
                waist: Number,
                arms: Number,
                legs: Number
            },
            personalRecords: {
                bench: Number,
                squat: Number,
                deadlift: Number
            }
        },
        
        // Achievement posts
        achievement: {
            type: String,
            enum: ['new_pr', 'weight_goal', 'consistency_milestone', 'challenge_completed'],
        },
        achievementValue: Number,
        
        // Tags and visibility
        tags: [String],
        isPublic: {
            type: Boolean,
            default: true
        },
        
        // Enhanced engagement
        comments: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            },
            comment: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        shares: []
    },
    {
        timestamps: true,
    }
)

const postModel = mongoose.model("Posts", postSchema);

export default postModel