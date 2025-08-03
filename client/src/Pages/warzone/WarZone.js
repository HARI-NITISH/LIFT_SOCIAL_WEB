import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './WarZone.css';
import NavIcons from '../../Components/NavIcons/NavIcons';
import ChallengeCard from '../../Components/ChallengeCard/ChallengeCard';
import CreateChallengeModal from '../../Components/CreateChallengeModal/CreateChallengeModal';

const WarZone = () => {
    const [activeChallenges, setActiveChallenges] = useState([]);
    const [userChallenges, setUserChallenges] = useState([]);
    const [activeTab, setActiveTab] = useState('active');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.authReducer.authData);

    useEffect(() => {
        fetchChallenges();
    }, [activeTab]);

    const fetchChallenges = async () => {
        setLoading(true);
        try {
            if (activeTab === 'active') {
                const response = await fetch('http://localhost:4000/challenge/active');
                const data = await response.json();
                setActiveChallenges(data);
            } else {
                const response = await fetch(`http://localhost:4000/challenge/user/${user._id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                setUserChallenges(data);
            }
        } catch (error) {
            console.error('Error fetching challenges:', error);
        }
        setLoading(false);
    };

    const handleJoinChallenge = async (challengeId) => {
        try {
            const response = await fetch(`http://localhost:4000/challenge/${challengeId}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ userId: user._id })
            });

            if (response.ok) {
                fetchChallenges(); // Refresh challenges
                alert('Successfully joined challenge!');
            } else {
                const errorData = await response.json();
                alert(errorData);
            }
        } catch (error) {
            console.error('Error joining challenge:', error);
            alert('Failed to join challenge');
        }
    };

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

    return (
        <div className="WarZone">
            <NavIcons />
            
            <div className="warzone-container">
                <div className="warzone-header">
                    <h1>⚔️ War Zone</h1>
                    <p>Challenge yourself and others to reach new fitness heights!</p>
                    
                    <div className="header-actions">
                        <div className="tab-buttons">
                            <button 
                                className={activeTab === 'active' ? 'active' : ''}
                                onClick={() => setActiveTab('active')}
                            >
                                🔥 Active Challenges
                            </button>
                            <button 
                                className={activeTab === 'mine' ? 'active' : ''}
                                onClick={() => setActiveTab('mine')}
                            >
                                📋 My Challenges
                            </button>
                        </div>
                        
                        <button 
                            className="create-challenge-btn"
                            onClick={() => setShowCreateModal(true)}
                        >
                            ⚔️ Create Challenge
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="loading">Loading challenges...</div>
                ) : (
                    <div className="challenges-grid">
                        {activeTab === 'active' ? (
                            activeChallenges.length > 0 ? (
                                activeChallenges.map(challenge => (
                                    <ChallengeCard 
                                        key={challenge._id}
                                        challenge={challenge}
                                        onJoin={() => handleJoinChallenge(challenge._id)}
                                        showJoinButton={!challenge.participants.some(p => p.userId === user._id)}
                                    />
                                ))
                            ) : (
                                <div className="empty-state">
                                    <h3>No active challenges found</h3>
                                    <p>Be the first to create a challenge!</p>
                                </div>
                            )
                        ) : (
                            userChallenges.length > 0 ? (
                                userChallenges.map(challenge => (
                                    <ChallengeCard 
                                        key={challenge._id}
                                        challenge={challenge}
                                        showProgress={true}
                                        userId={user._id}
                                    />
                                ))
                            ) : (
                                <div className="empty-state">
                                    <h3>You haven't joined any challenges yet</h3>
                                    <p>Check out the active challenges to get started!</p>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>

            {showCreateModal && (
                <CreateChallengeModal 
                    onClose={() => setShowCreateModal(false)}
                    onCreate={fetchChallenges}
                />
            )}
        </div>
    );
};

export default WarZone;
