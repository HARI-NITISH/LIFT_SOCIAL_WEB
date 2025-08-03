import ChallengeModel from "../Models/challengeModel.js";
import UserModel from "../Models/userModel.js";

// Create a new challenge
export const createChallenge = async (req, res) => {
    const challenge = new ChallengeModel(req.body);
    
    try {
        const newChallenge = await challenge.save();
        res.status(200).json(newChallenge);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Get all active challenges
export const getActiveChallenges = async (req, res) => {
    try {
        const challenges = await ChallengeModel.find({
            status: { $in: ['open', 'active'] },
            isPublic: true
        })
        .sort({ createdAt: -1 })
        .populate('creator', 'firstname lastname profilePicture eloRating')
        .populate('participants.userId', 'firstname lastname profilePicture eloRating');
        
        res.status(200).json(challenges);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Join a challenge
export const joinChallenge = async (req, res) => {
    const { challengeId } = req.params;
    const { userId } = req.body;
    
    try {
        const challenge = await ChallengeModel.findById(challengeId);
        
        // Check if user is already participating
        const isParticipating = challenge.participants.some(
            p => p.userId.toString() === userId
        );
        
        if (isParticipating) {
            return res.status(400).json("User already participating in this challenge");
        }
        
        // Check if challenge is full
        if (challenge.participants.length >= challenge.maxParticipants) {
            return res.status(400).json("Challenge is full");
        }
        
        await challenge.updateOne({
            $push: {
                participants: {
                    userId,
                    joinedAt: new Date(),
                    progress: {
                        currentValue: 0,
                        submissions: []
                    }
                }
            }
        });
        
        res.status(200).json("Successfully joined challenge");
    } catch (error) {
        res.status(500).json(error);
    }
};

// Submit progress for a challenge
export const submitProgress = async (req, res) => {
    const { challengeId } = req.params;
    const { userId, value, proof } = req.body;
    
    try {
        const challenge = await ChallengeModel.findOneAndUpdate(
            {
                _id: challengeId,
                "participants.userId": userId
            },
            {
                $push: {
                    "participants.$.progress.submissions": {
                        value,
                        proof,
                        submittedAt: new Date()
                    }
                },
                $set: {
                    "participants.$.progress.currentValue": value
                }
            },
            { new: true }
        );
        
        res.status(200).json(challenge);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Get user's challenges
export const getUserChallenges = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const challenges = await ChallengeModel.find({
            "participants.userId": userId
        })
        .populate('creator', 'firstname lastname profilePicture')
        .sort({ createdAt: -1 });
        
        res.status(200).json(challenges);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Complete challenge and update ELO ratings
export const completeChallenge = async (req, res) => {
    const { challengeId } = req.params;
    
    try {
        const challenge = await ChallengeModel.findById(challengeId);
        
        if (challenge.status !== 'active') {
            return res.status(400).json("Challenge is not active");
        }
        
        // Determine winners based on challenge type and target
        const sortedParticipants = challenge.participants
            .filter(p => p.progress.currentValue >= challenge.target.value)
            .sort((a, b) => b.progress.currentValue - a.progress.currentValue);
        
        const winners = sortedParticipants.map((participant, index) => ({
            userId: participant.userId,
            finalValue: participant.progress.currentValue,
            rank: index + 1
        }));
        
        // Update challenge status and winners
        await ChallengeModel.findByIdAndUpdate(challengeId, {
            status: 'completed',
            winners: winners,
            endDate: new Date()
        });
        
        // Update ELO ratings for participants
        for (const participant of challenge.participants) {
            const isWinner = winners.some(w => w.userId.toString() === participant.userId.toString());
            const eloChange = isWinner ? challenge.eloReward : -challenge.eloPenalty;
            
            await UserModel.findByIdAndUpdate(participant.userId, {
                $inc: { eloRating: eloChange }
            });
        }
        
        res.status(200).json("Challenge completed and ELO ratings updated");
    } catch (error) {
        res.status(500).json(error);
    }
};

// Get challenge leaderboard
export const getChallengeLeaderboard = async (req, res) => {
    const { challengeId } = req.params;
    
    try {
        const challenge = await ChallengeModel.findById(challengeId)
            .populate('participants.userId', 'firstname lastname profilePicture eloRating');
        
        const leaderboard = challenge.participants
            .sort((a, b) => b.progress.currentValue - a.progress.currentValue)
            .map((participant, index) => ({
                rank: index + 1,
                user: participant.userId,
                progress: participant.progress.currentValue,
                target: challenge.target.value,
                percentage: (participant.progress.currentValue / challenge.target.value) * 100
            }));
        
        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json(error);
    }
};
