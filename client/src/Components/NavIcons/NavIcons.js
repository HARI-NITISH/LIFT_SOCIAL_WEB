import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logOut } from '../../actions/AuthAction';
import './NavIcons.css';

const NavIcons = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.authReducer.authData);

    const handleLogout = () => {
        dispatch(logOut());
    };

    const navItems = [
        { icon: '🏠', label: 'Home', path: '/home' },
        { icon: '📱', label: 'Social', path: '/social' },
        { icon: '🏃‍♂️', label: 'Workouts', path: '/workouts' },
        { icon: '📅', label: 'Calendar', path: '/calendar' }
    ];

    return (
        <>
            <nav className="nav-icons">
                <div className="nav-header">
                    <div className="logo">
                        <span className="logo-icon">💪</span>
                        <span className="logo-text">FitSocial</span>
                    </div>
                </div>
                
                <div className="nav-items">
                    {navItems.map((item, index) => (
                        <div
                            key={index}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </div>
                    ))}
                </div>

                <div className="logout-section">
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>
            
            {/* Profile button positioned on the right side of the page */}
            <div className="profile-button-container">
                <div 
                    className={`profile-button ${location.pathname === '/profile' ? 'active' : ''}`}
                    onClick={() => navigate('/profile')}
                >
                    <img 
                        src={user?.user?.profilePicture || '/images/defaultProfile.png'} 
                        alt="profile" 
                        className="profile-avatar"
                    />
                    <span className="profile-icon">👤</span>
                </div>
            </div>
        </>
    );
};

export default NavIcons;
