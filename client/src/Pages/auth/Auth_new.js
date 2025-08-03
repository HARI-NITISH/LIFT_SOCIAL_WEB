import React, { useState } from 'react';
import './Auth.css';
import { useDispatch, useSelector } from 'react-redux';
import { logIn, signUp } from '../../actions/AuthAction.js';

const Auth = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.authReducer.loading);

    const [data, setData] = useState({ 
        firstname: "", 
        lastname: "", 
        email: "", 
        password: "", 
        confirmpass: ""
    });
    const [confirmPass, setConfirmPass] = useState(true);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const handlSubmit = (e) => {
        e.preventDefault();
        if (isSignUp) {
            data.password === data.confirmpass ? dispatch(signUp(data)) : setConfirmPass(false)
        } else {
            dispatch(logIn(data))
        }
    }

    const restForm = () => {
        setConfirmPass(true);
        setData({
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            confirmpass: ""
        });
    }

    return (
        <div className="auth">
            <div className="blur-bg"></div>
            <div className="a-left">
                <h1>FitSocial</h1>
                <h6>Connect with fitness enthusiasts and track your progress together!</h6>
            </div>

            <div className="a-right">
                <form className="info-form auth-form" onSubmit={handlSubmit}>
                    <h3>{isSignUp ? "Create Account" : "Welcome Back"}</h3>

                    {/* Demo User Info */}
                    {!isSignUp && (
                        <div className="demo-info">
                            <p><strong>Demo Accounts:</strong></p>
                            <div className="demo-users">
                                <div className="demo-user">
                                    <small>Email: john@fitsocial.com</small>
                                    <small>Password: password123</small>
                                </div>
                                <div className="demo-user">
                                    <small>Email: sarah@fitsocial.com</small>
                                    <small>Password: password123</small>
                                </div>
                                <div className="demo-user">
                                    <small>Email: mike@fitsocial.com</small>
                                    <small>Password: password123</small>
                                </div>
                            </div>
                        </div>
                    )}

                    {isSignUp && (
                        <div className="name-fields">
                            <input
                                type="text"
                                placeholder="First Name"
                                className="info-input"
                                name="firstname"
                                onChange={handleChange}
                                value={data.firstname}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="info-input"
                                name="lastname"
                                onChange={handleChange}
                                value={data.lastname}
                                required
                            />
                        </div>
                    )}

                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            className="info-input"
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className="info-input"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                        />

                        {isSignUp && (
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className="info-input"
                                name="confirmpass"
                                onChange={handleChange}
                                value={data.confirmpass}
                                required
                            />
                        )}
                    </div>

                    <span style={{
                        display: confirmPass ? "none" : "block",
                        color: "red",
                        fontSize: "12px",
                        alignSelf: "flex-end",
                        marginRight: "5px"
                    }}>
                        * Passwords do not match
                    </span>

                    <div>
                        <span 
                            style={{ fontSize: '12px', cursor: 'pointer', color: 'var(--primary)' }}
                            onClick={() => { setIsSignUp(!isSignUp); restForm() }}
                        >
                            {isSignUp ? "Already have an account? Sign in!" : "New to FitSocial? Join now"}
                        </span>
                    </div>

                    <button 
                        className="button info-button" 
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Please wait..." : isSignUp ? "Sign up" : "Sign in"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Auth;
