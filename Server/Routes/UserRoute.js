import express from "express";
import { 
    UnFollowUser, 
    deleteUser, 
    followUser, 
    getAllUsers, 
    getUser, 
    updateUser,
    getGlobalLeaderboard,
    getFriendsLeaderboard,
    updatePersonalRecords,
    updateELOFromWorkout,
    getFitnessStats,
    searchFitnessUsers
} from "../Controllers/UserController.js";
import authMiddleWare from "../Middleware/authMiddleWare.js";

const router = express.Router();

// Original routes
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id', authMiddleWare, updateUser);
router.delete('/:id', authMiddleWare, deleteUser);
router.put('/:id/follow', authMiddleWare, followUser);
router.put('/:id/unfollow', authMiddleWare, UnFollowUser);

// Fitness-specific routes
router.get('/leaderboard/global', getGlobalLeaderboard);
router.get('/leaderboard/friends/:userId', authMiddleWare, getFriendsLeaderboard);
router.put('/:userId/personal-records', authMiddleWare, updatePersonalRecords);
router.put('/:userId/elo-workout', authMiddleWare, updateELOFromWorkout);
router.get('/:userId/fitness-stats', getFitnessStats);
router.get('/search/fitness', searchFitnessUsers);

export default router;