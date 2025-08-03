import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NavIcons from '../../Components/NavIcons/NavIcons';
import './Social.css';

const Social = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [challengedFriends, setChallengedFriends] = useState(new Set());
    const [messagedFriends, setMessagedFriends] = useState(new Set());
    const user = useSelector((state) => state.authReducer.authData);

    useEffect(() => {
        fetchFriends();
    }, []);

    const handleChallenge = (friend) => {
        if (challengedFriends.has(friend._id)) {
            alert(`⚔️ You've already challenged ${friend.firstname}!\n\nWait for them to respond to your previous challenge.`);
            return;
        }
        
        const challengeTypes = [
            'Most workouts in a week',
            'Highest total volume in 5 days',
            'Longest workout streak',
            'Best bench press PR this month'
        ];
        
        const randomChallenge = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
        
        const confirmed = window.confirm(
            `🏋️‍♂️ Challenge ${friend.firstname} ${friend.lastname}?\n\n` +
            `Challenge: ${randomChallenge}\n` +
            `Duration: 1 week\n` +
            `Reward: Bragging rights + ELO points\n\n` +
            `Send this challenge?`
        );
        
        if (confirmed) {
            setChallengedFriends(prev => new Set([...prev, friend._id]));
            alert(`🎯 Challenge sent!\n\n${friend.firstname} will be notified and can accept or decline your challenge.`);
        }
    };

    const handleMessage = (friend) => {
        const quickMessages = [
            'Hey! Want to workout together?',
            'Great workout today! 💪',
            'Need a gym buddy for tomorrow?',
            'Saw your PR - incredible! 🔥',
            'Up for some cardio this evening?'
        ];
        
        const useQuickMessage = window.confirm(
            `💬 Message ${friend.firstname} ${friend.lastname}\n\n` +
            `Choose option:\n` +
            `OK = Send quick message\n` +
            `Cancel = Write custom message`
        );
        
        let message;
        if (useQuickMessage) {
            message = quickMessages[Math.floor(Math.random() * quickMessages.length)];
        } else {
            message = prompt(`✍️ Write your message to ${friend.firstname}:`, '');
        }
        
        if (message && message.trim()) {
            setMessagedFriends(prev => new Set([...prev, friend._id]));
            alert(`📤 Message sent to ${friend.firstname}!\n\n"${message}"\n\nThey'll receive your message shortly.`);
        }
    };

    const fetchFriends = async () => {
        try {
            // Mock data for now - you can replace this with actual API call
            const mockFriends = [
                {
                    _id: '1',
                    firstname: 'Alex',
                    lastname: 'Johnson',
                    eloRating: 1850,
                    profilePicture: '/images/defaultProfile.png',
                    isOnline: true,
                    totalWorkouts: 245,
                    workoutStreak: 15
                },
                {
                    _id: '2',
                    firstname: 'Sarah',
                    lastname: 'Williams',
                    eloRating: 2100,
                    profilePicture: '/images/defaultProfile.png',
                    isOnline: false,
                    totalWorkouts: 398,
                    workoutStreak: 22
                },
                {
                    _id: '3',
                    firstname: 'Mike',
                    lastname: 'Davis',
                    eloRating: 1650,
                    profilePicture: '/images/defaultProfile.png',
                    isOnline: true,
                    totalWorkouts: 187,
                    workoutStreak: 8
                },
                {
                    _id: '4',
                    firstname: 'Emma',
                    lastname: 'Brown',
                    eloRating: 1920,
                    profilePicture: '/images/defaultProfile.png',
                    isOnline: false,
                    totalWorkouts: 312,
                    workoutStreak: 18
                },
                {
                    _id: '5',
                    firstname: 'Jake',
                    lastname: 'Wilson',
                    eloRating: 1750,
                    profilePicture: '/images/defaultProfile.png',
                    isOnline: true,
                    totalWorkouts: 201,
                    workoutStreak: 12
                }
            ];
            
            // Sort friends by ELO rating (highest first)
            const sortedFriends = mockFriends.sort((a, b) => b.eloRating - a.eloRating);
            setFriends(sortedFriends);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
        setLoading(false);
    };

    const getRankFromElo = (elo) => {
        if (elo >= 2000) return { rank: 'Elite', color: '#FF6B6B' };
        if (elo >= 1700) return { rank: 'Advanced', color: '#4ECDC4' };
        if (elo >= 1400) return { rank: 'Intermediate', color: '#45B7D1' };
        return { rank: 'Beginner', color: '#96CEB4' };
    };

    if (loading) {
        return (
            <div className="social-page">
                <div className="loading">Loading friends...</div>
            </div>
        );
    }

    return (
        <div className="social-container">
            <NavIcons />
            <div className="social-page">
                <div className="social-header">
                    <h1>📱 My Friends</h1>
                    <p>Connect with your workout buddies and track their progress</p>
                </div>

            <div className="friends-stats">
                <div className="stat-card">
                    <span className="stat-number">{friends.length}</span>
                    <span className="stat-label">Total Friends</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">{friends.filter(f => f.isOnline).length}</span>
                    <span className="stat-label">Online Now</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">{Math.round(friends.reduce((acc, f) => acc + f.eloRating, 0) / friends.length)}</span>
                    <span className="stat-label">Avg ELO</span>
                </div>
            </div>

            <div className="friends-list">
                {friends.map((friend, index) => {
                    const rankInfo = getRankFromElo(friend.eloRating);
                    return (
                        <div key={friend._id} className="friend-card">
                            <div className="friend-rank">
                                #{index + 1}
                            </div>
                            
                            <div className="friend-avatar">
                                <img 
                                    src={friend.profilePicture} 
                                    alt={`${friend.firstname} ${friend.lastname}`}
                                    className="avatar-img"
                                />
                                <div className={`online-status ${friend.isOnline ? 'online' : 'offline'}`}></div>
                            </div>

                            <div className="friend-info">
                                <h3 className="friend-name">
                                    {friend.firstname} {friend.lastname}
                                </h3>
                                <div className="friend-rank-badge" style={{ backgroundColor: rankInfo.color }}>
                                    {rankInfo.rank}
                                </div>
                            </div>

                            <div className="friend-stats">
                                <div className="elo-section">
                                    <span className="elo-number">{friend.eloRating}</span>
                                    <span className="elo-label">ELO</span>
                                </div>
                                
                                <div className="workout-stats">
                                    <div className="stat">
                                        <span className="stat-value">{friend.totalWorkouts}</span>
                                        <span className="stat-name">Workouts</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-value">{friend.workoutStreak}</span>
                                        <span className="stat-name">Streak</span>
                                    </div>
                                </div>
                            </div>

                            <div className="friend-actions">
                                <button 
                                    className="action-btn challenge-btn"
                                    onClick={() => handleChallenge(friend)}
                                >
                                    ⚔️ Challenge
                                </button>
                                <button 
                                    className="action-btn message-btn"
                                    onClick={() => handleMessage(friend)}
                                >
                                    💬 Message
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {friends.length === 0 && (
                <div className="empty-friends">
                    <h3>No friends yet</h3>
                    <p>Start connecting with other fitness enthusiasts!</p>
                    <button className="find-friends-btn">Find Friends</button>
                </div>
            )}
            </div>
        </div>
    );
};

export default Social;
