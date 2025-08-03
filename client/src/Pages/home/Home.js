import React from 'react'
import './Home.css'
import NavIcons from '../../Components/NavIcons/NavIcons'
import FitnessFeed from '../../Components/FitnessFeed/FitnessFeed'

const Home = () => {
  return (
    <div className="Home">
        <NavIcons />
        <div className="home-content">
            <FitnessFeed />
        </div>
    </div>
  )
}

export default Home
