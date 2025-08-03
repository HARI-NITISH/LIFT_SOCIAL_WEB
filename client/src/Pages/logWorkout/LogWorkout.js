import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import NavIcons from '../../Components/NavIcons/NavIcons';
import { uploadPost } from '../../actions/UploadAction';
import { saveWorkout } from '../../utils/workoutStorage';
import './LogWorkout.css';

const LogWorkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [currentDate] = useState(new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }));
    
    const exerciseOptions = [
        { value: '', label: 'Select Exercise' },
        { value: 'deadlift', label: 'Deadlift' },
        { value: 'bench', label: 'Bench Press' },
        { value: 'squat', label: 'Squat' }
    ];
    
    const [exercises, setExercises] = useState([
        { id: 1, name: '', sets: [{ reps: '', weight: '' }] }
    ]);

    const [workoutDuration, setWorkoutDuration] = useState('00:00:00');
    const [workoutVolume, setWorkoutVolume] = useState(0);
    const [uploadedMedia, setUploadedMedia] = useState([]);
    const [workoutNotes, setWorkoutNotes] = useState('');

    const addExercise = () => {
        const newExercise = {
            id: exercises.length + 1,
            name: '',
            sets: [{ reps: '', weight: '' }]
        };
        setExercises([...exercises, newExercise]);
    };

    const updateExerciseName = (exerciseId, name) => {
        setExercises(exercises.map(ex => 
            ex.id === exerciseId ? { ...ex, name } : ex
        ));
    };

    const addSet = (exerciseId) => {
        setExercises(exercises.map(ex =>
            ex.id === exerciseId 
                ? { ...ex, sets: [...ex.sets, { reps: '', weight: '' }] }
                : ex
        ));
    };

    const updateSet = (exerciseId, setIndex, field, value) => {
        setExercises(exercises.map(ex =>
            ex.id === exerciseId
                ? {
                    ...ex,
                    sets: ex.sets.map((set, idx) =>
                        idx === setIndex ? { ...set, [field]: value } : set
                    )
                }
                : ex
        ));
    };

    const handleMediaUpload = (event) => {
        const files = Array.from(event.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const mediaItem = {
                    id: Date.now() + Math.random(),
                    file: file,
                    url: e.target.result,
                    type: file.type.startsWith('image/') ? 'image' : 'video',
                    name: file.name
                };
                setUploadedMedia(prev => [...prev, mediaItem]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeMedia = (mediaId) => {
        setUploadedMedia(prev => prev.filter(item => item.id !== mediaId));
    };

    const finishWorkout = async () => {
        // Calculate total volume
        const totalVolume = exercises.reduce((total, exercise) => {
            const exerciseVolume = exercise.sets.reduce((setTotal, set) => {
                const reps = parseInt(set.reps) || 0;
                const weight = parseInt(set.weight) || 0;
                return setTotal + (reps * weight);
            }, 0);
            return total + exerciseVolume;
        }, 0);

        // Create workout summary
        const exerciseSummary = exercises
            .filter(ex => ex.name) // Only include exercises with names
            .map(ex => {
                const setCount = ex.sets.filter(set => set.reps && set.weight).length;
                return `${ex.name}: ${setCount} sets`;
            }).join(', ');

        // Parse duration to minutes for storage
        const durationParts = workoutDuration.split(':');
        const durationMinutes = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]) + parseInt(durationParts[2]) / 60;

        // Determine workout type based on exercises
        const workoutType = exercises.some(ex => ['deadlift', 'bench', 'squat'].includes(ex.name)) 
            ? 'Strength' 
            : 'General';

        // Create workout data for storage
        const workoutData = {
            exercises: exercises.filter(ex => ex.name), // Only save exercises with names
            duration: Math.round(durationMinutes),
            volume: totalVolume,
            type: workoutType,
            notes: workoutNotes,
            exerciseSummary: exerciseSummary,
            hasMedia: uploadedMedia.length > 0,
            mediaCount: uploadedMedia.length
        };

        // Save workout to local storage
        const savedWorkout = saveWorkout(workoutData);
        
        if (!savedWorkout) {
            alert('Error saving workout data!');
            return;
        }

        // If there are uploaded media files, create a social post
        if (uploadedMedia.length > 0) {
            const workoutPostDesc = `💪 Just crushed my workout!\n\n${exerciseSummary}\n\n📊 Stats:\n• Volume: ${totalVolume} lbs\n• Duration: ${workoutDuration}\n\n${workoutNotes ? `📝 Notes: ${workoutNotes}\n\n` : ''}#FitSocial #WorkoutComplete #FitnessJourney`;
            
            // Create FormData for the post
            const postData = new FormData();
            postData.append('desc', workoutPostDesc);
            postData.append('userId', '64a3b2f9e1234567890abcd1'); // Demo user ID (since we removed auth)
            
            // Add the first uploaded image to the post
            if (uploadedMedia[0] && uploadedMedia[0].file) {
                postData.append('file', uploadedMedia[0].file);
            }

            try {
                // Upload the post to social feed
                await dispatch(uploadPost(postData));
                alert(`Workout completed and shared to your feed!\n\n✅ Saved to calendar\n📊 Total Volume: ${totalVolume} lbs\n⏱️ Duration: ${workoutDuration}\n📸 ${uploadedMedia.length} media files shared`);
            } catch (error) {
                console.error('Error sharing workout:', error);
                alert(`Workout completed and saved to calendar!\n\n📊 Total Volume: ${totalVolume} lbs\n⏱️ Duration: ${workoutDuration}\n\n⚠️ Note: Could not share to feed.`);
            }
        } else {
            alert(`Workout completed and saved to calendar!\n\n📊 Total Volume: ${totalVolume} lbs\n⏱️ Duration: ${workoutDuration}\n\n💡 Tip: Add photos to share your workout to the social feed!`);
        }
        
        navigate('/calendar'); // Navigate to calendar to see the saved workout
    };

    return (
        <div className="log-workout-container">
            <NavIcons />
            <div className="log-workout-page">
                <div className="workout-header">
                    <div className="header-left">
                        <h1>Today: {currentDate}</h1>
                    </div>
                    <div className="header-right">
                        <button onClick={finishWorkout} className="finish-btn">
                            Finish
                        </button>
                    </div>
                </div>

                <div className="workout-content">
                    <div className="exercises-section">
                        <div className="add-exercise-section">
                            <button onClick={addExercise} className="add-exercise-btn">
                                # Add Exercise
                            </button>
                        </div>

                        <div className="exercises-list">
                            {exercises.map((exercise, exerciseIndex) => (
                                <div key={exercise.id} className="exercise-card">
                                    <div className="exercise-header">
                                        <select
                                            value={exercise.name}
                                            onChange={(e) => updateExerciseName(exercise.id, e.target.value)}
                                            className="exercise-name-select"
                                        >
                                            {exerciseOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <button 
                                            onClick={() => addSet(exercise.id)}
                                            className="add-set-btn"
                                        >
                                            + Add Set
                                        </button>
                                    </div>

                                    <div className="sets-container">
                                        <div className="sets-header">
                                            <span className="set-label">Set</span>
                                            <span className="reps-label">Reps</span>
                                            <span className="weight-label">Weight (lbs)</span>
                                        </div>
                                        
                                        {exercise.sets.map((set, setIndex) => (
                                            <div key={setIndex} className="set-row">
                                                <span className="set-number">{setIndex + 1}</span>
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    value={set.reps}
                                                    onChange={(e) => updateSet(exercise.id, setIndex, 'reps', e.target.value)}
                                                    className="reps-input"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    value={set.weight}
                                                    onChange={(e) => updateSet(exercise.id, setIndex, 'weight', e.target.value)}
                                                    className="weight-input"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Media Upload Section */}
                    <div className="media-section">
                        <h3>📸 Share Your Workout</h3>
                        <div className="media-upload-container">
                            <input
                                type="file"
                                id="media-upload"
                                multiple
                                accept="image/*,video/*"
                                onChange={handleMediaUpload}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="media-upload" className="upload-btn">
                                <span className="upload-icon">📷</span>
                                Add Photos/Videos
                            </label>
                            
                            {uploadedMedia.length > 0 && (
                                <>
                                    <div className="share-notification">
                                        🌟 This workout will be shared to your social feed when completed!
                                    </div>
                                    <div className="media-preview">
                                        {uploadedMedia.map((media) => (
                                            <div key={media.id} className="media-item">
                                                {media.type === 'image' ? (
                                                    <img 
                                                        src={media.url} 
                                                        alt="workout" 
                                                        className="media-thumbnail"
                                                    />
                                                ) : (
                                                    <video 
                                                        src={media.url} 
                                                        className="media-thumbnail"
                                                        controls
                                                    />
                                                )}
                                                <button 
                                                    onClick={() => removeMedia(media.id)}
                                                    className="remove-media-btn"
                                                >
                                                    ✕
                                                </button>
                                                <span className="media-name">{media.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Workout Notes Section */}
                    <div className="notes-section">
                        <h3>📝 Workout Notes</h3>
                        <textarea
                            value={workoutNotes}
                            onChange={(e) => setWorkoutNotes(e.target.value)}
                            placeholder="How did your workout feel? Any notes about form, energy levels, or achievements?"
                            className="workout-notes-textarea"
                            rows={4}
                        />
                    </div>

                    <div className="workout-stats">
                        <div className="stat-card">
                            <h3>Duration:</h3>
                            <span className="stat-value">{workoutDuration}</span>
                        </div>
                        <div className="stat-card">
                            <h3>Volume:</h3>
                            <span className="stat-value">{workoutVolume} lbs</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogWorkout;
