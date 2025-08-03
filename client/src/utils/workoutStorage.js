// Simple workout storage using localStorage
const WORKOUT_STORAGE_KEY = 'fitsocial_workouts';

export const saveWorkout = (workoutData) => {
    try {
        const existingWorkouts = getWorkouts();
        const newWorkout = {
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
            timestamp: new Date().toISOString(),
            ...workoutData
        };
        
        existingWorkouts.push(newWorkout);
        localStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(existingWorkouts));
        return newWorkout;
    } catch (error) {
        console.error('Error saving workout:', error);
        return null;
    }
};

export const getWorkouts = () => {
    try {
        const workouts = localStorage.getItem(WORKOUT_STORAGE_KEY);
        return workouts ? JSON.parse(workouts) : [];
    } catch (error) {
        console.error('Error getting workouts:', error);
        return [];
    }
};

export const getWorkoutsByDate = (date) => {
    const workouts = getWorkouts();
    return workouts.filter(workout => workout.date === date);
};

export const getWorkoutsByMonth = (year, month) => {
    const workouts = getWorkouts();
    const monthString = month.toString().padStart(2, '0');
    const yearMonthPrefix = `${year}-${monthString}`;
    
    return workouts.filter(workout => workout.date.startsWith(yearMonthPrefix));
};

export const deleteWorkout = (workoutId) => {
    try {
        const workouts = getWorkouts();
        const filteredWorkouts = workouts.filter(workout => workout.id !== workoutId);
        localStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(filteredWorkouts));
        return true;
    } catch (error) {
        console.error('Error deleting workout:', error);
        return false;
    }
};

export const getWorkoutStats = () => {
    const workouts = getWorkouts();
    const totalWorkouts = workouts.length;
    const workoutDays = new Set(workouts.map(w => w.date)).size;
    const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    const totalVolume = workouts.reduce((sum, w) => sum + (w.volume || 0), 0);
    
    return {
        totalWorkouts,
        workoutDays,
        totalDuration,
        totalVolume
    };
};
