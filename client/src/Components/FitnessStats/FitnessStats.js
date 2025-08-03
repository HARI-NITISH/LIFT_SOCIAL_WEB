import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './FitnessStats.css';

const FitnessStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.authReducer.authData);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch(`http://localhost:4000/user/${user._id}/fitness-stats`);
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="fitness-stats">
                <div className="loading">Loading stats...</div>
            </div>
        );
    }

    return (
        <div className="fitness-stats">
            <div className="stats-header">
                <h3>� Your Calendar</h3>
            </div>

            <div className="stats-content">
                <div className="elo-section">
                    <div className="elo-score">
                        <span className="elo-number">{user.eloRating || 1200}</span>
                        <span className="elo-label">ELO Rating</span>
                    </div>
                    <div className="elo-rank">
                        {user.eloRating >= 2000 ? 'Elite' :
                         user.eloRating >= 1700 ? 'Advanced' :
                         user.eloRating >= 1400 ? 'Intermediate' : 'Beginner'}
                    </div>
                </div>

                <div className="quick-stats">
                    <div className="stat-item">
                        <span className="stat-icon">🏋️</span>
                        <div className="stat-info">
                            <span className="stat-value">{stats?.user?.totalWorkouts || 0}</span>
                            <span className="stat-label">Total Workouts</span>
                        </div>
                    </div>

                    <div className="stat-item">
                        <span className="stat-icon">🔥</span>
                        <div className="stat-info">
                            <span className="stat-value">{stats?.user?.workoutStreak || 0}</span>
                            <span className="stat-label">Day Streak</span>
                        </div>
                    </div>

                    <div className="stat-item">
                        <span className="stat-icon">⏱️</span>
                        <div className="stat-info">
                            <span className="stat-value">{Math.round(stats?.averageWorkoutDuration || 0)}</span>
                            <span className="stat-label">Avg Duration</span>
                        </div>
                    </div>
                </div>

                {stats?.user?.personalRecords && (
                    <div className="personal-records">
                        <h4>Personal Records</h4>
                        <div className="pr-grid">
                            <div className="pr-item">
                                <span className="pr-icon">💪</span>
                                <div className="pr-info">
                                    <span className="pr-value">{stats.user.personalRecords.bench || 0}</span>
                                    <span className="pr-label">Bench Press</span>
                                </div>
                            </div>
                            <div className="pr-item">
                                <span className="pr-icon">🦵</span>
                                <div className="pr-info">
                                    <span className="pr-value">{stats.user.personalRecords.squat || 0}</span>
                                    <span className="pr-label">Squat</span>
                                </div>
                            </div>
                            <div className="pr-item">
                                <span className="pr-icon">🏋️</span>
                                <div className="pr-info">
                                    <span className="pr-value">{stats.user.personalRecords.deadlift || 0}</span>
                                    <span className="pr-label">Deadlift</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="action-buttons">
                    <button className="action-btn primary">
                        🏋️ Log Workout
                    </button>
                    <button className="action-btn secondary">
                        📈 Update PRs
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FitnessStats;
