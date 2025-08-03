import WorkoutModel from "../Models/workoutModel.js";
import UserModel from "../Models/userModel.js";
import mongoose from "mongoose";

// Create a new workout
export const createWorkout = async (req, res) => {
    const workout = new WorkoutModel(req.body);
    
    try {
        const newWorkout = await workout.save();
        
        // Update user's workout stats
        await UserModel.findByIdAndUpdate(
            req.body.userId,
            {
                $inc: { totalWorkouts: 1 },
                lastWorkoutDate: new Date()
            }
        );
        
        res.status(200).json(newWorkout);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Get user's workouts
export const getUserWorkouts = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const workouts = await WorkoutModel.find({ userId })
            .sort({ createdAt: -1 })
            .populate('userId', 'firstname lastname profilePicture');
        
        res.status(200).json(workouts);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Get workout feed (public workouts from followed users)
export const getWorkoutFeed = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const currentUser = await UserModel.findById(userId);
        const followingUsers = currentUser.following;
        followingUsers.push(userId); // Include user's own workouts
        
        const workouts = await WorkoutModel.find({
            userId: { $in: followingUsers },
            isPublic: true
        })
        .sort({ createdAt: -1 })
        .limit(20)
        .populate('userId', 'firstname lastname profilePicture eloRating');
        
        res.status(200).json(workouts);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Like/Unlike a workout
export const likeWorkout = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    
    try {
        const workout = await WorkoutModel.findById(id);
        
        if (workout.likes.includes(userId)) {
            await workout.updateOne({ $pull: { likes: userId } });
            res.status(200).json("Workout unliked");
        } else {
            await workout.updateOne({ $push: { likes: userId } });
            res.status(200).json("Workout liked");
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// Add comment to workout
export const addWorkoutComment = async (req, res) => {
    const { id } = req.params;
    const { userId, comment } = req.body;
    
    try {
        const workout = await WorkoutModel.findByIdAndUpdate(
            id,
            {
                $push: {
                    comments: {
                        userId,
                        comment,
                        createdAt: new Date()
                    }
                }
            },
            { new: true }
        ).populate('comments.userId', 'firstname lastname profilePicture');
        
        res.status(200).json(workout);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Get workout statistics
export const getWorkoutStats = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const stats = await WorkoutModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalWorkouts: { $sum: 1 },
                    totalDuration: { $sum: "$duration" },
                    avgDuration: { $avg: "$duration" },
                    totalCalories: { $sum: "$caloriesBurned" },
                    workoutTypes: { $push: "$workoutType" }
                }
            }
        ]);
        
        res.status(200).json(stats[0] || {});
    } catch (error) {
        res.status(500).json(error);
    }
};
