import React from 'react';
import './PostCard.css';

const PostCard = ({ post }) => {
    return (
        <div className="post-card">
            <div className="post-header">
                <img 
                    src={post.userPicture || '/images/defaultProfile.png'} 
                    alt="profile" 
                    className="post-avatar"
                />
                <div className="post-user-info">
                    <h4>{post.userName || 'Anonymous'}</h4>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            
            <div className="post-content">
                <p>{post.desc}</p>
                {post.image && (
                    <img src={post.image} alt="post" className="post-image" />
                )}
            </div>

            <div className="post-footer">
                <button className="like-btn">
                    ❤️ {post.likes?.length || 0}
                </button>
                <button className="comment-btn">
                    💬 Comment
                </button>
                <button className="share-btn">
                    📤 Share
                </button>
            </div>
        </div>
    );
};

export default PostCard;
