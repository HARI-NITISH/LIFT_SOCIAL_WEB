import React from 'react';
import './ChallengeCard.css';

const ChallengeCard = ({ challenge, onJoin, showJoinButton, showProgress, userId }) => {
    const getChallengeTypeIcon = (type) => {
        const icons = {
            strength: '💪',
            endurance: '🏃‍♂️',
            consistency: '📅',
            weight_loss: '⚖️',
            personal_record: '🏆'
        };
        return icons[type] || '🎯';
    };

    const getStatusColor = (status) => {
        const colors = {
            open: '#f39c12',
            active: '#27ae60',
            completed: '#3498db',
            cancelled: '#e74c3c'
        };
        return colors[status] || '#95a5a6';
    };

    const getDaysRemaining = () => {
        if (!challenge.endDate) return 'No end date';
        const today = new Date();
        const endDate = new Date(challenge.endDate);
        const diffTime = endDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'Expired';
        if (diffDays === 0) return 'Ends today';
        return `${diffDays} days left`;
    };

    const getUserProgress = () => {
        if (!showProgress || !userId) return null;
        const participant = challenge.participants.find(p => p.userId === userId);
        return participant ? participant.progress : null;
    };

    const userProgress = getUserProgress();
    const progressPercentage = userProgress 
        ? Math.min((userProgress.currentValue / challenge.target.value) * 100, 100)
        : 0;

    return (
        <div className="challenge-card">
            <div className="challenge-header">
                <div className="challenge-type">
                    <span className="type-icon">{getChallengeTypeIcon(challenge.challengeType)}</span>
                    <span className="type-name">{challenge.challengeType.replace('_', ' ')}</span>
                </div>
                <div 
                    className="challenge-status"
                    style={{ backgroundColor: getStatusColor(challenge.status) }}
                >
                    {challenge.status}
                </div>
            </div>

            <div className="challenge-content">
                <h3 className="challenge-title">{challenge.title}</h3>
                <p className="challenge-description">{challenge.description}</p>

                <div className="challenge-details">
                    <div className="detail-item">
                        <span className="detail-label">Target:</span>
                        <span className="detail-value">
                            {challenge.target.value} {challenge.target.unit}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Duration:</span>
                        <span className="detail-value">{challenge.duration} days</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Participants:</span>
                        <span className="detail-value">
                            {challenge.participants.length}/{challenge.maxParticipants}
                        </span>
                    </div>
                </div>

                <div className="challenge-creator">
                    <img 
                        src={challenge.creator.profilePicture || '/images/defaultProfile.png'} 
                        alt="creator" 
                        className="creator-avatar"
                    />
                    <div className="creator-info">
                        <span className="creator-name">
                            {challenge.creator.firstname} {challenge.creator.lastname}
                        </span>
                        <span className="creator-elo">ELO: {challenge.creator.eloRating}</span>
                    </div>
                </div>

                {showProgress && userProgress && (
                    <div className="progress-section">
                        <div className="progress-header">
                            <span>Your Progress</span>
                            <span>{userProgress.currentValue}/{challenge.target.value}</span>
                        </div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                        <div className="progress-percentage">
                            {progressPercentage.toFixed(1)}% Complete
                        </div>
                    </div>
                )}

                <div className="challenge-footer">
                    <div className="time-remaining">
                        <span className="time-icon">⏰</span>
                        <span>{getDaysRemaining()}</span>
                    </div>
                    
                    <div className="reward-info">
                        <span className="reward-label">Reward:</span>
                        <span className="reward-value">+{challenge.eloReward} ELO</span>
                    </div>
                </div>
            </div>

            {showJoinButton && (
                <div className="challenge-actions">
                    <button 
                        className="join-btn"
                        onClick={onJoin}
                        disabled={challenge.participants.length >= challenge.maxParticipants}
                    >
                        {challenge.participants.length >= challenge.maxParticipants 
                            ? 'Challenge Full' 
                            : 'Join Challenge'
                        }
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChallengeCard;
