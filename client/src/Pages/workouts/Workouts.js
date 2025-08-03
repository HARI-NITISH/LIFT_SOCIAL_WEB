import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NavIcons from '../../Components/NavIcons/NavIcons';
import { saveWorkout } from '../../utils/workoutStorage';
import { uploadPost } from '../../actions/UploadAction';
import './Workouts.css';

const Workouts = () => {
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [activeRoutine, setActiveRoutine] = useState(null);
    const [routineStartTime, setRoutineStartTime] = useState(null);
    const [prs, setPrs] = useState({
        bench: { weight: 225, completed: false },
        squat: { weight: 315, completed: false },
        deadlift: { weight: 405, completed: false }
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.authReducer.authData);

    const routines = [
        {
            id: 1,
            name: 'Routine 1',
            description: 'Upper Body Strength',
            exercises: [
                { name: 'bench', displayName: 'Bench Press', sets: 4, reps: '8-10', weight: 185 },
                { name: 'Pull-ups', displayName: 'Pull-ups', sets: 3, reps: '8-12', weight: 0 },
                { name: 'Overhead Press', displayName: 'Overhead Press', sets: 3, reps: '10-12', weight: 95 },
                { name: 'Barbell Rows', displayName: 'Barbell Rows', sets: 3, reps: '10-12', weight: 135 }
            ],
            estimatedDuration: 45,
            type: 'Strength'
        },
        {
            id: 2,
            name: 'Routine 2', 
            description: 'Lower Body Power',
            exercises: [
                { name: 'squat', displayName: 'Squats', sets: 4, reps: '6-8', weight: 225 },
                { name: 'deadlift', displayName: 'Deadlifts', sets: 3, reps: '5-6', weight: 275 },
                { name: 'Bulgarian Split Squats', displayName: 'Bulgarian Split Squats', sets: 3, reps: '12-15', weight: 40 },
                { name: 'Calf Raises', displayName: 'Calf Raises', sets: 4, reps: '15-20', weight: 60 }
            ],
            estimatedDuration: 50,
            type: 'Strength'
        },
        {
            id: 3,
            name: 'Routine 3',
            description: 'Full Body Circuit',
            exercises: [
                { name: 'Burpees', displayName: 'Burpees', sets: 3, reps: '10-15', weight: 0 },
                { name: 'Mountain Climbers', displayName: 'Mountain Climbers', sets: 3, reps: '30 sec', weight: 0 },
                { name: 'Push-ups', displayName: 'Push-ups', sets: 3, reps: '12-20', weight: 0 },
                { name: 'Jumping Jacks', displayName: 'Jumping Jacks', sets: 3, reps: '30 sec', weight: 0 }
            ],
            estimatedDuration: 30,
            type: 'Cardio'
        }
    ];

    const handlePRToggle = (exercise) => {
        setPrs(prev => ({
            ...prev,
            [exercise]: {
                ...prev[exercise],
                completed: !prev[exercise].completed
            }
        }));
    };

    const startRoutine = (routine) => {
        setActiveRoutine(routine);
        setRoutineStartTime(new Date());
        alert(`Started ${routine.name}!\n\nEstimated Duration: ${routine.estimatedDuration} minutes\n\nClick "Finish Routine" when you're done to save it to your calendar.`);
    };

    const finishRoutine = async () => {
        if (!activeRoutine || !routineStartTime) return;

        const endTime = new Date();
        const durationMinutes = Math.round((endTime - routineStartTime) / (1000 * 60));

        // Calculate total volume (estimated based on routine exercises)
        const totalVolume = activeRoutine.exercises.reduce((total, exercise) => {
            return total + (exercise.sets * exercise.reps.split('-')[0] * exercise.weight);
        }, 0);

        // Create exercise summary
        const exerciseSummary = activeRoutine.exercises
            .map(ex => `${ex.displayName}: ${ex.sets} sets`)
            .join(', ');

        // Create workout data for storage
        const workoutData = {
            exercises: activeRoutine.exercises.map(ex => ({
                id: Date.now() + Math.random(),
                name: ex.name,
                sets: Array(ex.sets).fill().map(() => ({
                    reps: ex.reps.split('-')[0], // Use minimum reps
                    weight: ex.weight.toString()
                }))
            })),
            duration: durationMinutes,
            volume: totalVolume,
            type: activeRoutine.type,
            notes: `Completed ${activeRoutine.name} - ${activeRoutine.description}`,
            exerciseSummary: exerciseSummary,
            hasMedia: false,
            mediaCount: 0,
            routineName: activeRoutine.name,
            isFromRoutine: true
        };

        // Save workout to local storage
        const savedWorkout = saveWorkout(workoutData);
        
        if (savedWorkout) {
            // Create a social post for the completed routine
            try {
                const workoutPostDesc = `💪 Just completed ${activeRoutine.name}!\n\n${exerciseSummary}\n\n📊 Stats:\n• Volume: ${totalVolume} lbs\n• Duration: ${durationMinutes} min\n• Type: ${activeRoutine.type}\n\n#FitSocial #RoutineComplete #${activeRoutine.type}Training`;
                
                const postData = new FormData();
                postData.append('desc', workoutPostDesc);
                postData.append('userId', '64a3b2f9e1234567890abcd1'); // Demo user ID
                
                await dispatch(uploadPost(postData));
                
                alert(`🎉 Routine completed and shared!\n\n✅ Saved to calendar\n📊 Volume: ${totalVolume} lbs\n⏱️ Duration: ${durationMinutes} min\n📱 Posted to social feed`);
            } catch (error) {
                console.error('Error sharing routine:', error);
                alert(`🎉 Routine completed!\n\n✅ Saved to calendar\n📊 Volume: ${totalVolume} lbs\n⏱️ Duration: ${durationMinutes} min\n\n⚠️ Could not share to feed`);
            }
        } else {
            alert('Error saving routine data!');
        }

        // Reset routine state
        setActiveRoutine(null);
        setRoutineStartTime(null);
        navigate('/calendar'); // Navigate to calendar to see the workout
    };

    const handleLogWorkoutClick = () => {
        navigate('/log-workout');
    };

    return (
        <div className="workouts-container">
            <NavIcons />
            <div className="workouts-page">
                <div className="workouts-header">
                    <h1>🏃‍♂️ Workouts</h1>
                    <p>Track your fitness journey and build strength</p>
                </div>

                <div className="workouts-content">
                    {/* Log a Workout Section */}
                    <div className="log-workout-section">
                        <h2>📝 Log a Workout</h2>
                        <button onClick={handleLogWorkoutClick} className="log-workout-btn">
                            + Start New Workout Session
                        </button>
                    </div>

                    <div className="main-content">
                        {/* Workout Routines Section */}
                        <div className="routines-section">
                            <h2>💪 Workout Routines</h2>
                            
                            {/* Active Routine Banner */}
                            {activeRoutine && (
                                <div className="active-routine-banner">
                                    <div className="active-routine-info">
                                        <h3>🔥 Currently doing: {activeRoutine.name}</h3>
                                        <p>Started at: {routineStartTime.toLocaleTimeString()}</p>
                                    </div>
                                    <button onClick={finishRoutine} className="finish-routine-btn">
                                        Finish Routine
                                    </button>
                                </div>
                            )}
                            
                            <div className="routines-list">
                                {routines.map(routine => (
                                    <div 
                                        key={routine.id} 
                                        className={`routine-card ${selectedRoutine === routine.id ? 'selected' : ''} ${activeRoutine?.id === routine.id ? 'active' : ''}`}
                                        onClick={() => setSelectedRoutine(selectedRoutine === routine.id ? null : routine.id)}
                                    >
                                        <div className="routine-header">
                                            <h3>{routine.name}</h3>
                                            <span className="duration">{routine.estimatedDuration} min</span>
                                        </div>
                                        <p className="routine-description">{routine.description}</p>
                                        
                                        {selectedRoutine === routine.id && (
                                            <div className="routine-details">
                                                <h4>Exercises:</h4>
                                                <div className="exercises-grid">
                                                    {routine.exercises.map((exercise, index) => (
                                                        <div key={index} className="exercise-item">
                                                            <span className="exercise-name">{exercise.displayName}</span>
                                                            <span className="exercise-details">
                                                                {exercise.sets} sets × {exercise.reps} reps
                                                                {exercise.weight > 0 && ` @ ${exercise.weight}lbs`}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button 
                                                    className={`start-routine-btn ${activeRoutine ? 'disabled' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (!activeRoutine) startRoutine(routine);
                                                    }}
                                                    disabled={!!activeRoutine}
                                                >
                                                    {activeRoutine?.id === routine.id ? 'In Progress...' : 
                                                     activeRoutine ? 'Finish Current Routine First' : 'Start Routine'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Current PRs Section */}
                        <div className="prs-section">
                            <h2>🏆 Current PR's</h2>
                            <div className="prs-list">
                                <div className="pr-item">
                                    <div className="pr-info">
                                        <span className="pr-name">Bench</span>
                                        <span className="pr-weight">{prs.bench.weight} lbs</span>
                                    </div>
                                    <label className="pr-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={prs.bench.completed}
                                            onChange={() => handlePRToggle('bench')}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>

                                <div className="pr-item">
                                    <div className="pr-info">
                                        <span className="pr-name">Squat</span>
                                        <span className="pr-weight">{prs.squat.weight} lbs</span>
                                    </div>
                                    <label className="pr-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={prs.squat.completed}
                                            onChange={() => handlePRToggle('squat')}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>

                                <div className="pr-item">
                                    <div className="pr-info">
                                        <span className="pr-name">Deadlift</span>
                                        <span className="pr-weight">{prs.deadlift.weight} lbs</span>
                                    </div>
                                    <label className="pr-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={prs.deadlift.completed}
                                            onChange={() => handlePRToggle('deadlift')}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Workouts;
