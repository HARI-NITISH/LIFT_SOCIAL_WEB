import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        profilePicture: String,
        coverPicture: String,
        about: String,
        
        // Fitness-specific fields
        eloRating: {
            type: Number,
            default: 1200 // Starting ELO rating
        },
        bodyWeight: {
            type: Number,
            default: 0
        },
        height: {
            type: Number,
            default: 0
        },
        age: {
            type: Number,
            default: 0
        },
        fitnessGoals: {
            type: String,
            enum: ['strength', 'endurance', 'weight_loss', 'muscle_gain', 'general_fitness'],
            default: 'general_fitness'
        },
        experienceLevel: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'beginner'
        },
        
        // Personal Records
        personalRecords: {
            bench: { type: Number, default: 0 },
            squat: { type: Number, default: 0 },
            deadlift: { type: Number, default: 0 }
        },
        
        // Activity tracking
        workoutStreak: {
            type: Number,
            default: 0
        },
        totalWorkouts: {
            type: Number,
            default: 0
        },
        lastWorkoutDate: Date,
        
        // Social features
        followers: [],
        following: [],
        
        // Location for local leaderboards
        city: String,
        country: String,
        
        // Privacy settings
        profileVisibility: {
            type: String,
            enum: ['public', 'friends', 'private'],
            default: 'public'
        }
    },
    { timestamps: true }
)


const UserModel = mongoose.model("Users", UserSchema);

export default UserModel