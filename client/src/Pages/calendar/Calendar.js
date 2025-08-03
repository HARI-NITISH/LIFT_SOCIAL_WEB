import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NavIcons from '../../Components/NavIcons/NavIcons';
import { getWorkouts, getWorkoutsByMonth, getWorkoutStats, getWorkoutsByDate } from '../../utils/workoutStorage';
import './Calendar.css';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [workoutData, setWorkoutData] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [stats, setStats] = useState({
        totalWorkouts: 0,
        workoutDays: 0,
        totalDuration: 0,
        totalVolume: 0
    });

    useEffect(() => {
        loadWorkoutData();
        loadStats();
    }, [currentDate]);

    const loadWorkoutData = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const monthWorkouts = getWorkoutsByMonth(year, month + 1); // +1 because getMonth() returns 0-based month
        
        const data = {};
        monthWorkouts.forEach(workout => {
            const dateKey = workout.date;
            if (!data[dateKey]) {
                data[dateKey] = [];
            }
            data[dateKey].push(workout);
        });
        
        setWorkoutData(data);
    };

    const loadStats = () => {
        const workoutStats = getWorkoutStats();
        setStats(workoutStats);
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    };

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const getWorkoutForDate = (day) => {
        if (!day) return null;
        const dateKey = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return workoutData[dateKey];
    };

    const getWorkoutIntensity = (workouts) => {
        if (!workouts || workouts.length === 0) return '';
        if (workouts.length >= 2) return 'high';
        return 'medium';
    };

    const days = getDaysInMonth();

    return (
        <div className="calendar-container">
            <NavIcons />
            <div className="calendar-page">
                <div className="calendar-header">
                    <h1>📅 Workout Calendar</h1>
                    <p>Track your fitness journey day by day</p>
                </div>

                <div className="calendar-stats">
                    <div className="stat-card">
                        <span className="stat-number">{stats.totalWorkouts}</span>
                        <span className="stat-label">Total Workouts</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{stats.workoutDays}</span>
                        <span className="stat-label">Active Days</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{Math.round(stats.totalDuration / 60)}h</span>
                        <span className="stat-label">Total Hours</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{stats.totalVolume}</span>
                        <span className="stat-label">Volume (lbs)</span>
                    </div>
                </div>

                <div className="calendar-widget">
                    <div className="calendar-nav">
                        <button onClick={() => navigateMonth(-1)} className="nav-btn">
                            ◀ Previous
                        </button>
                        <h2 className="month-year">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <button onClick={() => navigateMonth(1)} className="nav-btn">
                            Next ▶
                        </button>
                    </div>

                    <div className="calendar-grid">
                        <div className="weekdays">
                            {weekDays.map(day => (
                                <div key={day} className="weekday">{day}</div>
                            ))}
                        </div>

                        <div className="days-grid">
                            {days.map((day, index) => {
                                const workouts = getWorkoutForDate(day);
                                const intensity = getWorkoutIntensity(workouts);
                                const isToday = day === new Date().getDate() && 
                                              currentDate.getMonth() === new Date().getMonth() &&
                                              currentDate.getFullYear() === new Date().getFullYear();

                                return (
                                    <div
                                        key={index}
                                        className={`calendar-day ${intensity} ${isToday ? 'today' : ''} ${!day ? 'empty' : ''}`}
                                        onClick={() => day && setSelectedDate({day, workouts})}
                                    >
                                        {day && (
                                            <>
                                                <span className="day-number">{day}</span>
                                                {workouts && workouts.length > 0 && (
                                                    <div className="workout-indicator">
                                                        <span className="workout-count">{workouts.length}</span>
                                                        <span className="workout-emoji">💪</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {selectedDate && (
                    <div className="workout-details">
                        <h3>Workout Details - {monthNames[currentDate.getMonth()]} {selectedDate.day}</h3>
                        {selectedDate.workouts && selectedDate.workouts.length > 0 ? (
                            <div className="details-content">
                                {selectedDate.workouts.map((workout, index) => (
                                    <div key={workout.id || index} className="workout-item">
                                        <div className="workout-header">
                                            <h4>Workout {index + 1} {workout.hasMedia && '📸'}</h4>
                                            <span className="workout-type">{workout.type}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Exercises:</span>
                                            <span className="detail-value">{workout.exerciseSummary || 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Duration:</span>
                                            <span className="detail-value">{workout.duration} min</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Volume:</span>
                                            <span className="detail-value">{workout.volume} lbs</span>
                                        </div>
                                        {workout.notes && (
                                            <div className="detail-item">
                                                <span className="detail-label">Notes:</span>
                                                <span className="detail-value">{workout.notes}</span>
                                            </div>
                                        )}
                                        <div className="detail-item">
                                            <span className="detail-label">Time:</span>
                                            <span className="detail-value">{new Date(workout.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-workout">No workout recorded for this day</p>
                        )}
                        <button onClick={() => setSelectedDate(null)} className="close-details">
                            Close
                        </button>
                    </div>
                )}

                <div className="legend">
                    <h4>Workout Intensity</h4>
                    <div className="legend-items">
                        <div className="legend-item">
                            <div className="legend-color high"></div>
                            <span>High (2+ workouts)</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color medium"></div>
                            <span>Medium (1 workout)</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color low"></div>
                            <span>Low activity</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
