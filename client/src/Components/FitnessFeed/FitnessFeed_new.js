import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './FitnessFeed.css';

const FitnessFeed = () => {
    const [posts, setPosts] = useState([]);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.authReducer.authData);

    useEffect(() => {
        fetchFeedData();
    }, []);

    const fetchFeedData = async () => {
        setLoading(true);
        try {
            // Mock data for Instagram-style feed
            const mockStories = [
                { id: 1, username: 'jonathan_salley', avatar: '/images/defaultProfile.png', hasStory: true },
                { id: 2, username: 'johnysmith', avatar: '/images/defaultProfile.png', hasStory: true },
                { id: 3, username: 'calvarymagazine', avatar: '/images/defaultProfile.png', hasStory: true },
                { id: 4, username: 'theorganic', avatar: '/images/defaultProfile.png', hasStory: true },
                { id: 5, username: 'thejason', avatar: '/images/defaultProfile.png', hasStory: true },
                { id: 6, username: 'calvarylos', avatar: '/images/defaultProfile.png', hasStory: true },
            ];

            const mockPosts = [
                {
                    id: 1,
                    username: 'calvarymagazine',
                    avatar: '/images/defaultProfile.png',
                    image: '/images/postPic1.jpg',
                    likes: 850,
                    caption: 'AS IRON SHARPENS IRON - SOCIAL MEN\'S CONFERENCE. Eight thousand men attended the five event at the Mountain Convention. #iron #socialmen #conference',
                    timeAgo: '1 DAY AGO',
                    isLiked: false,
                    location: 'Mountain Convention Center'
                },
                {
                    id: 2,
                    username: 'jonathan_salley',
                    avatar: '/images/defaultProfile.png',
                    image: '/images/postPic2.jpg',
                    likes: 324,
                    caption: 'Great workout session today! Feeling stronger every day 💪 #fitness #motivation #workout',
                    timeAgo: '3 HOURS AGO',
                    isLiked: true,
                    location: 'San Francisco, California'
                },
                {
                    id: 3,
                    username: 'fitnessguru',
                    avatar: '/images/defaultProfile.png',
                    image: '/images/postPic3.jpg',
                    likes: 567,
                    caption: 'Morning cardio session complete! Nothing beats the feeling of accomplishment after a good run 🏃‍♂️',
                    timeAgo: '5 HOURS AGO',
                    isLiked: false,
                    location: 'Central Park'
                }
            ];

            setStories(mockStories);
            setPosts(mockPosts);
        } catch (error) {
            console.error('Error fetching feed:', error);
        }
        setLoading(false);
    };

    const toggleLike = (postId) => {
        setPosts(posts.map(post => 
            post.id === postId 
                ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
                : post
        ));
    };

    if (loading) {
        return (
            <div className="fitness-feed">
                <div className="loading">Loading feed...</div>
            </div>
        );
    }

    return (
        <div className="fitness-feed">
            {/* Stories Section */}
            <div className="stories-container">
                <div className="stories-scroll">
                    {stories.map(story => (
                        <div key={story.id} className="story-item">
                            <div className={`story-avatar ${story.hasStory ? 'has-story' : ''}`}>
                                <img src={story.avatar} alt={story.username} />
                            </div>
                            <span className="story-username">{story.username}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Posts Section */}
            <div className="posts-container">
                {posts.map(post => (
                    <div key={post.id} className="post-card">
                        {/* Post Header */}
                        <div className="post-header">
                            <div className="post-user-info">
                                <img src={post.avatar} alt={post.username} className="post-avatar" />
                                <div className="post-user-details">
                                    <span className="post-username">{post.username}</span>
                                    <span className="post-location">{post.location}</span>
                                </div>
                            </div>
                            <button className="post-options">
                                <span>⋯</span>
                            </button>
                        </div>

                        {/* Post Image */}
                        <div className="post-image">
                            <img src={post.image} alt="Post content" />
                        </div>

                        {/* Post Actions */}
                        <div className="post-actions">
                            <div className="action-buttons">
                                <button 
                                    className={`action-btn like-btn ${post.isLiked ? 'liked' : ''}`}
                                    onClick={() => toggleLike(post.id)}
                                >
                                    {post.isLiked ? '❤️' : '🤍'}
                                </button>
                                <button className="action-btn comment-btn">💬</button>
                                <button className="action-btn share-btn">📤</button>
                            </div>
                            <button className="action-btn bookmark-btn">🔖</button>
                        </div>

                        {/* Post Likes */}
                        <div className="post-likes">
                            <span>{post.likes.toLocaleString()} likes</span>
                        </div>

                        {/* Post Caption */}
                        <div className="post-caption">
                            <span className="caption-username">{post.username}</span>
                            <span className="caption-text">{post.caption}</span>
                        </div>

                        {/* Post Time */}
                        <div className="post-time">
                            {post.timeAgo}
                        </div>

                        {/* Add Comment */}
                        <div className="add-comment">
                            <input type="text" placeholder="Add a comment..." />
                            <button>Post</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FitnessFeed;
