import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './WorkoutShare.css';

const WorkoutShare = ({ onWorkoutShared }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [workoutData, setWorkoutData] = useState({
        title: '',
        description: '',
        duration: '',
        workoutType: 'mixed',
        caloriesBurned: '',
        exercises: []
    });

    const user = useSelector((state) => state.authReducer.authData);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:4000/workout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    ...workoutData,
                    userId: user._id,
                    duration: parseInt(workoutData.duration),
                    caloriesBurned: parseInt(workoutData.caloriesBurned) || 0
                })
            });

            if (response.ok) {
                setWorkoutData({
                    title: '',
                    description: '',
                    duration: '',
                    workoutType: 'mixed',
                    caloriesBurned: '',
                    exercises: []
                });
                setIsExpanded(false);
                onWorkoutShared();
                alert('Workout shared successfully!');
            }
        } catch (error) {
            console.error('Error sharing workout:', error);
            alert('Failed to share workout');
        }
    };

    return (
        <div className="workout-share">
            {!isExpanded ? (
                <div className="workout-prompt" onClick={() => setIsExpanded(true)}>
                    <img 
                        src={user.profilePicture || '/images/defaultProfile.png'} 
                        alt="profile" 
                        className="user-avatar"
                    />
                    <div className="prompt-text">
                        💪 Share your workout with the community!
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="workout-form">
                    <div className="form-header">
                        <h3>🏋️‍♂️ Log Your Workout</h3>
                        <button 
                            type="button" 
                            className="close-btn"
                            onClick={() => setIsExpanded(false)}
                        >
                            ✕
                        </button>
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Workout title (e.g., Morning Push Session)"
                            value={workoutData.title}
                            onChange={(e) => setWorkoutData(prev => ({...prev, title: e.target.value}))}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <textarea
                            placeholder="Describe your workout..."
                            value={workoutData.description}
                            onChange={(e) => setWorkoutData(prev => ({...prev, description: e.target.value}))}
                            rows="3"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="number"
                                placeholder="Duration (minutes)"
                                value={workoutData.duration}
                                onChange={(e) => setWorkoutData(prev => ({...prev, duration: e.target.value}))}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <select
                                value={workoutData.workoutType}
                                onChange={(e) => setWorkoutData(prev => ({...prev, workoutType: e.target.value}))}
                            >
                                <option value="strength">💪 Strength</option>
                                <option value="cardio">🏃‍♂️ Cardio</option>
                                <option value="mixed">🔄 Mixed</option>
                                <option value="flexibility">🧘‍♀️ Flexibility</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <input
                                type="number"
                                placeholder="Calories burned"
                                value={workoutData.caloriesBurned}
                                onChange={(e) => setWorkoutData(prev => ({...prev, caloriesBurned: e.target.value}))}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => setIsExpanded(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="share-btn">
                            Share Workout
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default WorkoutShare;
