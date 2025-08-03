import UserModel from "../Models/userModel.js";
import WorkoutModel from "../Models/workoutModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


// get All users
export const getAllUsers = async (req, res) => {

    try {
        let users = await UserModel.find();

        users = users.map((user) => {
            const { password, ...otherDetails } = user._doc;
            return otherDetails;
        })

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json(error);
    }
}



// get a user
export const getUser = async (req, res) => {
    const id = req.params.id;

    try {

        const user = await UserModel.findById(id);

        if (user) {
            const { password, ...otherDetails } = user._doc
            res.status(200).json(otherDetails)
        } else {
            res.status(404).json("Please, Try again it is invaild user!")
        }
    }
    catch (error) {
        res.status(500).json(error)
    }
}


//Update a user

export const updateUser = async (req, res) => {
    const id = req.params.id;

    const { _id, password } = req.body;

    if (id === _id) {

        if (password) {
            const salt = await bcrypt.genSalt(10);
            let pass = password.toString();
            req.body.password = await bcrypt.hash(pass, salt)
        }

        try {
            const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });

            const token = jwt.sign(
                { email: user.email, id: user._id },
                process.env.JWT_KEY
            );

            res.status(200).json({ user, token })
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("Access Denied! You can only update your own profile")
    }
}



// Delete a User

export const deleteUser = async (req, res) => {
    const id = req.params.id;

    const { _id, currentUserAdminStatus } = req.body;

    if (_id === id || currentUserAdminStatus) {
        try {
            await UserModel.findByIdAndDelete(id);
            res.status(200).json("User deleted successfully")
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("Access Denied! You can only update your own profile")
    }
}



// Follow a User

export const followUser = async (req, res) => {
    const id = req.params.id;

    const { _id } = req.body;

    if (_id === id) {
        res.status(403).json("Action forbidden")
    } else {
        try {

            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(_id);

            if (!followUser.followers.includes(_id)) {
                await followUser.updateOne({ $push: { followers: _id } })
                await followingUser.updateOne({ $push: { following: id } })

                res.status(200).json("User Followed!")
            } else {
                res.status(403).json("User is Already followed by you")
            }

        } catch (error) {
            res.status(500).json(error)
        }
    }
}



// UnFollow a User

export const UnFollowUser = async (req, res) => {
    const id = req.params.id;

    const { _id } = req.body;

    if (_id === id) {
        res.status(403).json("Action forbidden")
    } else {
        try {

            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(_id);

            if (followUser.followers.includes(_id)) {
                await followUser.updateOne({ $pull: { followers: _id } })
                await followingUser.updateOne({ $pull: { following: id } })

                res.status(200).json("User Unfollowed!")
            } else {
                res.status(403).json("User is not followed by you")
            }

        } catch (error) {
            res.status(500).json(error)
        }
    }
}

// Fitness-specific endpoints

// Get Global Leaderboard
export const getGlobalLeaderboard = async (req, res) => {
    try {
        const users = await UserModel.find({
            profileVisibility: { $in: ['public', 'friends'] }
        })
        .select('firstname lastname profilePicture eloRating totalWorkouts personalRecords city country')
        .sort({ eloRating: -1 })
        .limit(100);
        
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Get Friends Leaderboard
export const getFriendsLeaderboard = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const user = await UserModel.findById(userId).select('following');
        const friendIds = user.following;
        friendIds.push(userId); // Include current user
        
        const friends = await UserModel.find({
            _id: { $in: friendIds }
        })
        .select('firstname lastname profilePicture eloRating totalWorkouts personalRecords')
        .sort({ eloRating: -1 });
        
        res.status(200).json(friends);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Update Personal Records and ELO
export const updatePersonalRecords = async (req, res) => {
    const { userId } = req.params;
    const { bench, squat, deadlift, bodyWeight } = req.body;
    
    try {
        const user = await UserModel.findById(userId);
        const oldPRs = user.personalRecords;
        
        // Calculate ELO increase based on PR improvements
        let eloIncrease = 0;
        
        if (bench > oldPRs.bench) eloIncrease += 10;
        if (squat > oldPRs.squat) eloIncrease += 10;
        if (deadlift > oldPRs.deadlift) eloIncrease += 10;
        
        // Bonus for strength-to-bodyweight ratios
        if (bodyWeight > 0) {
            const strengthToWeight = (bench + squat + deadlift) / bodyWeight;
            if (strengthToWeight > 3) eloIncrease += 20; // Strong ratio bonus
        }
        
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                personalRecords: { bench, squat, deadlift },
                bodyWeight,
                $inc: { eloRating: eloIncrease }
            },
            { new: true }
        );
        
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Calculate and update user's ELO based on workout consistency
export const updateELOFromWorkout = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const user = await UserModel.findById(userId);
        const today = new Date();
        const lastWorkout = user.lastWorkoutDate;
        
        let eloChange = 5; // Base ELO for completing a workout
        
        // Consistency bonus
        if (lastWorkout) {
            const daysSinceLastWorkout = Math.floor((today - lastWorkout) / (1000 * 60 * 60 * 24));
            if (daysSinceLastWorkout === 1) {
                // Consecutive day bonus
                eloChange += 10;
                await UserModel.findByIdAndUpdate(userId, {
                    $inc: { workoutStreak: 1 }
                });
            } else if (daysSinceLastWorkout > 3) {
                // Penalty for long gaps
                eloChange -= 5;
                await UserModel.findByIdAndUpdate(userId, {
                    workoutStreak: 1
                });
            } else {
                await UserModel.findByIdAndUpdate(userId, {
                    workoutStreak: 1
                });
            }
        }
        
        // Update ELO and workout stats
        await UserModel.findByIdAndUpdate(userId, {
            $inc: { 
                eloRating: eloChange,
                totalWorkouts: 1
            },
            lastWorkoutDate: today
        });
        
        res.status(200).json({ eloChange, message: "ELO updated successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
};

// Get user's fitness stats
export const getFitnessStats = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const user = await UserModel.findById(userId)
            .select('eloRating totalWorkouts workoutStreak personalRecords bodyWeight height age fitnessGoals');
        
        // Get recent workout data
        const recentWorkouts = await WorkoutModel.find({ userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('duration caloriesBurned workoutType createdAt');
        
        const stats = {
            user,
            recentWorkouts,
            averageWorkoutDuration: recentWorkouts.reduce((acc, w) => acc + w.duration, 0) / recentWorkouts.length || 0,
            totalCaloriesBurned: recentWorkouts.reduce((acc, w) => acc + (w.caloriesBurned || 0), 0)
        };
        
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Search users by fitness criteria
export const searchFitnessUsers = async (req, res) => {
    const { query, fitnessGoals, experienceLevel, city } = req.query;
    
    try {
        let searchCriteria = {
            profileVisibility: { $in: ['public', 'friends'] }
        };
        
        if (query) {
            searchCriteria.$or = [
                { firstname: { $regex: query, $options: 'i' } },
                { lastname: { $regex: query, $options: 'i' } }
            ];
        }
        
        if (fitnessGoals) {
            searchCriteria.fitnessGoals = fitnessGoals;
        }
        
        if (experienceLevel) {
            searchCriteria.experienceLevel = experienceLevel;
        }
        
        if (city) {
            searchCriteria.city = { $regex: city, $options: 'i' };
        }
        
        const users = await UserModel.find(searchCriteria)
            .select('firstname lastname profilePicture eloRating fitnessGoals experienceLevel city totalWorkouts')
            .sort({ eloRating: -1 })
            .limit(50);
        
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
};
