import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './Leaderboard.css';
import NavIcons from '../../Components/NavIcons/NavIcons';

const Leaderboard = () => {
    const [activeTab, setActiveTab] = useState('global');
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.authReducer.authData);

    useEffect(() => {
        fetchLeaderboardData();
    }, [activeTab]);

    const fetchLeaderboardData = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'global' 
                ? 'http://localhost:4000/user/leaderboard/global'
                : `http://localhost:4000/user/leaderboard/friends/${user._id}`;
            
            const response = await fetch(endpoint, {
                headers: activeTab === 'friends' ? {
                    'Authorization': `Bearer ${user.token}`
                } : {}
            });
            
            const data = await response.json();
            setLeaderboardData(data);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        }
        setLoading(false);
    };

    const getRankBadge = (rank) => {
        if (rank === 1) return '🏆';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return rank;
    };

    const getELORank = (elo) => {
        if (elo >= 2000) return 'Elite';
        if (elo >= 1700) return 'Advanced';
        if (elo >= 1400) return 'Intermediate';
        return 'Beginner';
    };

    return (
        <div className="Leaderboard">
            <NavIcons />
            
            <div className="leaderboard-container">
                <div className="leaderboard-header">
                    <h1>🏃‍♂️ Fitness Leaderboard</h1>
                    <div className="tab-buttons">
                        <button 
                            className={activeTab === 'global' ? 'active' : ''}
                            onClick={() => setActiveTab('global')}
                        >
                            🌍 Global
                        </button>
                        <button 
                            className={activeTab === 'friends' ? 'active' : ''}
                            onClick={() => setActiveTab('friends')}
                        >
                            👥 Friends
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="loading">Loading leaderboard...</div>
                ) : (
                    <div className="leaderboard-list">
                        {leaderboardData.map((member, index) => (
                            <div key={member._id} className={`leaderboard-card ${member._id === user._id ? 'current-user' : ''}`}>
                                <div className="rank">
                                    {getRankBadge(index + 1)}
                                </div>
                                
                                <div className="user-info">
                                    <img 
                                        src={member.profilePicture || '/images/defaultProfile.png'} 
                                        alt="profile" 
                                        className="profile-pic"
                                    />
                                    <div className="user-details">
                                        <h3>{member.firstname} {member.lastname}</h3>
                                        <p className="location">{member.city && `📍 ${member.city}`}</p>
                                    </div>
                                </div>

                                <div className="stats">
                                    <div className="elo-section">
                                        <div className="elo-score">{member.eloRating}</div>
                                        <div className="elo-rank">{getELORank(member.eloRating)}</div>
                                    </div>
                                    
                                    <div className="additional-stats">
                                        <div className="stat">
                                            <span className="stat-value">{member.totalWorkouts}</span>
                                            <span className="stat-label">Workouts</span>
                                        </div>
                                        
                                        {member.personalRecords && (
                                            <div className="personal-records">
                                                <div className="pr-item">
                                                    <span>💪 {member.personalRecords.bench || 0}</span>
                                                </div>
                                                <div className="pr-item">
                                                    <span>🦵 {member.personalRecords.squat || 0}</span>
                                                </div>
                                                <div className="pr-item">
                                                    <span>🏋️ {member.personalRecords.deadlift || 0}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
