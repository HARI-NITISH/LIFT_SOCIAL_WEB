import express from "express";
import {
    createChallenge,
    getActiveChallenges,
    joinChallenge,
    submitProgress,
    getUserChallenges,
    completeChallenge,
    getChallengeLeaderboard
} from "../Controllers/ChallengeController.js";

const router = express.Router();

router.post("/", createChallenge);
router.get("/active", getActiveChallenges);
router.post("/:challengeId/join", joinChallenge);
router.post("/:challengeId/progress", submitProgress);
router.get("/user/:userId", getUserChallenges);
router.put("/:challengeId/complete", completeChallenge);
router.get("/:challengeId/leaderboard", getChallengeLeaderboard);

export default router;
