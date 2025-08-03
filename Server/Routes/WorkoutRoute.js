import express from "express";
import {
    createWorkout,
    getUserWorkouts,
    getWorkoutFeed,
    likeWorkout,
    addWorkoutComment,
    getWorkoutStats
} from "../Controllers/WorkoutController.js";

const router = express.Router();

router.post("/", createWorkout);
router.get("/user/:userId", getUserWorkouts);
router.get("/feed/:userId", getWorkoutFeed);
router.put("/:id/like", likeWorkout);
router.post("/:id/comment", addWorkoutComment);
router.get("/stats/:userId", getWorkoutStats);

export default router;
