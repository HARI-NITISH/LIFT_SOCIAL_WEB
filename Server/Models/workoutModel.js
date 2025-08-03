import mongoose from "mongoose";

const ExerciseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sets: [{
        reps: Number,
        weight: Number,
        restTime: Number // in seconds
    }],
    exerciseType: {
        type: String,
        enum: ['strength', 'cardio', 'flexibility', 'endurance'],
        default: 'strength'
    },
    muscleGroups: [{
        type: String,
        enum: ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardio']
    }]
});

const WorkoutSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: String,
        exercises: [ExerciseSchema],
        duration: {
            type: Number, // in minutes
            required: true
        },
        caloriesBurned: Number,
        workoutType: {
            type: String,
            enum: ['strength', 'cardio', 'mixed', 'flexibility'],
            default: 'mixed'
        },
        intensity: {
            type: String,
            enum: ['low', 'moderate', 'high'],
            default: 'moderate'
        },
        photos: [String], // URLs to workout photos
        isPublic: {
            type: Boolean,
            default: true
        },
        likes: [],
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
        // ELO calculation factors
        eloImpact: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

const WorkoutModel = mongoose.model("Workouts", WorkoutSchema);
export default WorkoutModel;
