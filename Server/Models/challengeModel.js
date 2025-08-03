import mongoose from "mongoose";

const ChallengeSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        },
        challengeType: {
            type: String,
            enum: ['strength', 'endurance', 'consistency', 'weight_loss', 'personal_record'],
            required: true
        },
        
        // Challenge parameters
        target: {
            value: Number, // Target value (e.g., weight, reps, days)
            unit: String   // Unit (e.g., 'lbs', 'reps', 'days', 'miles')
        },
        duration: {
            type: Number, // Duration in days
            required: true
        },
        
        // Participants
        participants: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            },
            joinedAt: {
                type: Date,
                default: Date.now
            },
            progress: {
                currentValue: {
                    type: Number,
                    default: 0
                },
                submissions: [{
                    value: Number,
                    proof: String, // URL to photo/video proof
                    submittedAt: {
                        type: Date,
                        default: Date.now
                    },
                    verified: {
                        type: Boolean,
                        default: false
                    }
                }]
            },
            completed: {
                type: Boolean,
                default: false
            }
        }],
        
        // Challenge settings
        maxParticipants: {
            type: Number,
            default: 100
        },
        isPublic: {
            type: Boolean,
            default: true
        },
        requiresProof: {
            type: Boolean,
            default: true
        },
        
        // Challenge status
        status: {
            type: String,
            enum: ['open', 'active', 'completed', 'cancelled'],
            default: 'open'
        },
        startDate: Date,
        endDate: Date,
        
        // Rewards/Stakes
        eloReward: {
            type: Number,
            default: 50
        },
        eloPenalty: {
            type: Number,
            default: 25
        },
        
        // Results
        winners: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            },
            finalValue: Number,
            rank: Number
        }]
    },
    { timestamps: true }
);

const ChallengeModel = mongoose.model("Challenges", ChallengeSchema);
export default ChallengeModel;
