import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NavIcons from '../../Components/NavIcons/NavIcons';
import './Profile.css';

const Profile = () => {
    const user = useSelector((state) => state.authReducer.authData);
    const [userStats, setUserStats] = useState({
        totalWorkouts: 0,
        totalPosts: 0,
        currentStreak: 0,
        followers: 0,
        following: 0
    });

    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        // Mock user stats
        setUserStats({
            totalWorkouts: 47,
            totalPosts: 23,
            currentStreak: 7,
            followers: 156,
            following: 89
        });

        // Mock user posts
        setUserPosts([
            {
                id: 1,
                type: 'workout',
                content: 'Just crushed leg day! 💪 New squat PR: 315lbs',
                image: '/images/postPic1.jpg',
                likes: 24,
                comments: 8,
                timestamp: '2 hours ago'
            },
            {
                id: 2,
                type: 'achievement',
                content: '🎉 Hit my 30-day workout streak! Consistency is key!',
                likes: 45,
                comments: 12,
                timestamp: '1 day ago'
            },
            {
                id: 3,
                type: 'workout',
                content: 'Morning cardio session ✅ Ready to tackle the day!',
                image: '/images/postPic2.jpg',
                likes: 18,
                comments: 5,
                timestamp: '2 days ago'
            },
            {
                id: 4,
                type: 'nutrition',
                content: 'Meal prep Sunday! 🥗 Staying consistent with my nutrition goals',
                image: '/images/postPic3.jpg',
                likes: 32,
                comments: 7,
                timestamp: '3 days ago'
            },
            {
                id: 5,
                type: 'workout',
                content: 'Back and biceps day complete! Feeling stronger every week 💪',
                likes: 21,
                comments: 6,
                timestamp: '4 days ago'
            }
        ]);
    }, []);

    const getPostIcon = (type) => {
        switch (type) {
            case 'workout': return '🏋️‍♂️';
            case 'achievement': return '🏆';
            case 'nutrition': return '🥗';
            default: return '💪';
        }
    };

    return (
        <div className="profile-container">
            <NavIcons />
            <div className="profile-page">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="profile-cover">
                        <img 
                            src="/images/defaultCover.jpg" 
                            alt="cover" 
                            className="cover-image"
                        />
                    </div>
                    <div className="profile-info">
                        <div className="profile-picture-section">
                            <img 
                                src={user?.user?.profilePicture || '/images/defaultProfile.png'} 
                                alt="profile" 
                                className="profile-picture"
                            />
                            <button className="edit-profile-btn">Edit Profile</button>
                        </div>
                        <div className="profile-details">
                            <h1 className="profile-name">
                                {user?.user?.firstname} {user?.user?.lastname}
                            </h1>
                            <p className="profile-bio">
                                Fitness enthusiast 💪 | Passionate about healthy living | 
                                ELO Rating: {user?.user?.eloRating || 1200}
                            </p>
                            <div className="profile-stats">
                                <div className="stat-item">
                                    <span className="stat-number">{userStats.totalWorkouts}</span>
                                    <span className="stat-label">Workouts</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{userStats.totalPosts}</span>
                                    <span className="stat-label">Posts</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{userStats.currentStreak}</span>
                                    <span className="stat-label">Day Streak</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{userStats.followers}</span>
                                    <span className="stat-label">Followers</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{userStats.following}</span>
                                    <span className="stat-label">Following</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="profile-content">
                    <div className="content-section">
                        <h2>📊 Fitness Overview</h2>
                        <div className="fitness-overview">
                            <div className="overview-card">
                                <h3>🏋️‍♂️ Recent PRs</h3>
                                <div className="pr-list">
                                    <div className="pr-item">
                                        <span>Bench Press</span>
                                        <span>225 lbs</span>
                                    </div>
                                    <div className="pr-item">
                                        <span>Squat</span>
                                        <span>315 lbs</span>
                                    </div>
                                    <div className="pr-item">
                                        <span>Deadlift</span>
                                        <span>405 lbs</span>
                                    </div>
                                </div>
                            </div>
                            <div className="overview-card">
                                <h3>📈 This Month</h3>
                                <div className="month-stats">
                                    <div className="month-stat">
                                        <span>Workouts Completed</span>
                                        <span>16</span>
                                    </div>
                                    <div className="month-stat">
                                        <span>Total Volume</span>
                                        <span>24,500 lbs</span>
                                    </div>
                                    <div className="month-stat">
                                        <span>Average Duration</span>
                                        <span>68 min</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="content-section">
                        <h2>📝 My Posts</h2>
                        <div className="posts-grid">
                            {userPosts.map((post) => (
                                <div key={post.id} className="post-card">
                                    <div className="post-header">
                                        <div className="post-type">
                                            <span className="post-icon">{getPostIcon(post.type)}</span>
                                            <span className="post-timestamp">{post.timestamp}</span>
                                        </div>
                                        <div className="post-actions">
                                            <button className="post-action-btn">⋯</button>
                                        </div>
                                    </div>
                                    
                                    <div className="post-content">
                                        <p>{post.content}</p>
                                        {post.image && (
                                            <img 
                                                src={post.image} 
                                                alt="post content" 
                                                className="post-image"
                                            />
                                        )}
                                    </div>
                                    
                                    <div className="post-footer">
                                        <div className="post-engagement">
                                            <button className="engagement-btn">
                                                <span>❤️</span>
                                                <span>{post.likes}</span>
                                            </button>
                                            <button className="engagement-btn">
                                                <span>💬</span>
                                                <span>{post.comments}</span>
                                            </button>
                                            <button className="engagement-btn">
                                                <span>📤</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile
