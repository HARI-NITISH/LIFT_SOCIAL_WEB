import './App.css';
import Home from './Pages/home/Home';
import Social from './Pages/social/Social';
import Calendar from './Pages/calendar/Calendar';
import Workouts from './Pages/workouts/Workouts';
import LogWorkout from './Pages/logWorkout/LogWorkout';
import Profile from './Pages/profile/Profile';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {

  return (
    <div className="App">
      <div className="blur" style={{ top: '-18%', right: '0' }}></div>
      <div className="blur" style={{ top: '36%', left: '-8rem' }}></div>

      <Routes>
        <Route path='/' element={<Navigate to='home' />} />
        <Route path='/home' element={<Home />} />
        <Route path='/social' element={<Social />} />
        <Route path='/workouts' element={<Workouts />} />
        <Route path='/log-workout' element={<LogWorkout />} />
        <Route path='/calendar' element={<Calendar />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>

    </div>
  );
}

export default App;
