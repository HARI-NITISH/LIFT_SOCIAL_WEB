import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import NavIcons from '../../Components/NavIcons/NavIcons';
import './Workouts.css';

const Workouts = () => {
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [workoutLog, setWorkoutLog] = useState({
        exercise: '',
        sets: '',
        reps: '',
        weight: ''
    });
    const [prs, setPrs] = useState({
        bench: { weight: 225, completed: false },
        squat: { weight: 315, completed: false },
        deadlift: { weight: 405, completed: false }
    });

    const user = useSelector((state) => state.authReducer.authData);

    const routines = [
        {
            id: 1,
            name: 'Routine 1',
            description: 'Upper Body Strength',
            exercises: ['Bench Press', 'Pull-ups', 'Overhead Press', 'Rows'],
            duration: '45 min'
        },
        {
            id: 2,
            name: 'Routine 2', 
            description: 'Lower Body Power',
            exercises: ['Squats', 'Deadlifts', 'Lunges', 'Calf Raises'],
            duration: '50 min'
        },
        {
            id: 3,
            name: 'Routine 3',
            description: 'Full Body Circuit',
            exercises: ['Burpees', 'Mountain Climbers', 'Push-ups', 'Jumping Jacks'],
            duration: '30 min'
        }
    ];

    const handleLogWorkout = (e) => {
        e.preventDefault();
        // Handle workout logging logic here
        console.log('Logging workout:', workoutLog);
        // Reset form
        setWorkoutLog({
            exercise: '',
            sets: '',
            reps: '',
            weight: ''
        });
        alert('Workout logged successfully!');
    };

    const handlePRToggle = (exercise) => {
        setPrs(prev => ({
            ...prev,
            [exercise]: {
                ...prev[exercise],
                completed: !prev[exercise].completed
            }
        }));
    };

    const handleInputChange = (field, value) => {
        setWorkoutLog(prev => ({
            ...prev,
            [field]: value
        }));
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
                        <form onSubmit={handleLogWorkout} className="workout-form">
                            <div className="form-group">
                                <label>Exercise</label>
                                <input
                                    type="text"
                                    placeholder="Enter exercise name"
                                    value={workoutLog.exercise}
                                    onChange={(e) => handleInputChange('exercise', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Sets</label>
                                    <input
                                        type="number"
                                        placeholder="Sets"
                                        value={workoutLog.sets}
                                        onChange={(e) => handleInputChange('sets', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Reps</label>
                                    <input
                                        type="number"
                                        placeholder="Reps"
                                        value={workoutLog.reps}
                                        onChange={(e) => handleInputChange('reps', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Weight (lbs)</label>
                                    <input
                                        type="number"
                                        placeholder="Weight"
                                        value={workoutLog.weight}
                                        onChange={(e) => handleInputChange('weight', e.target.value)}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="log-btn">Log Workout</button>
                        </form>
                    </div>

                    <div className="main-content">
                        {/* Workout Routines Section */}
                        <div className="routines-section">
                            <h2>💪 Workout Routines</h2>
                            <div className="routines-list">
                                {routines.map(routine => (
                                    <div 
                                        key={routine.id} 
                                        className={`routine-card ${selectedRoutine === routine.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedRoutine(selectedRoutine === routine.id ? null : routine.id)}
                                    >
                                        <div className="routine-header">
                                            <h3>{routine.name}</h3>
                                            <span className="duration">{routine.duration}</span>
                                        </div>
                                        <p className="routine-description">{routine.description}</p>
                                        
                                        {selectedRoutine === routine.id && (
                                            <div className="routine-details">
                                                <h4>Exercises:</h4>
                                                <ul className="exercises-list">
                                                    {routine.exercises.map((exercise, index) => (
                                                        <li key={index}>{exercise}</li>
                                                    ))}
                                                </ul>
                                                <button className="start-routine-btn">
                                                    Start Routine
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
