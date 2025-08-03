import UserModel from '../Models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Simple demo users for testing
const demoUsers = [
    {
        _id: "64a3b2f9e1234567890abcd1",
        firstname: "John",
        lastname: "Doe",
        email: "john@fitsocial.com",
        password: "password123", // Plain text for demo
        age: 28,
        bodyWeight: 180,
        height: 72,
        fitnessGoals: "muscle_gain",
        experienceLevel: "intermediate",
        eloRating: 1450,
        about: "Fitness enthusiast who loves strength training!",
        profileVisibility: "public",
        workoutStreak: 12,
        totalWorkouts: 89,
        personalRecords: {
            bench: 225,
            squat: 275,
            deadlift: 315
        },
        followers: [],
        following: []
    },
    {
        _id: "64a3b2f9e1234567890abcd2",
        firstname: "Sarah",
        lastname: "Wilson",
        email: "sarah@fitsocial.com",
        password: "password123", // Plain text for demo
        age: 25,
        bodyWeight: 135,
        height: 65,
        fitnessGoals: "weight_loss",
        experienceLevel: "beginner",
        eloRating: 1200,
        about: "Just started my fitness journey!",
        profileVisibility: "public",
        workoutStreak: 5,
        totalWorkouts: 23,
        personalRecords: {
            bench: 85,
            squat: 135,
            deadlift: 155
        },
        followers: [],
        following: []
    },
    {
        _id: "64a3b2f9e1234567890abcd3",
        firstname: "Mike",
        lastname: "Johnson",
        email: "mike@fitsocial.com",
        password: "password123", // Plain text for demo
        age: 32,
        bodyWeight: 200,
        height: 74,
        fitnessGoals: "endurance",
        experienceLevel: "advanced",
        eloRating: 1650,
        about: "Marathon runner and CrossFit athlete",
        profileVisibility: "public",
        workoutStreak: 25,
        totalWorkouts: 156,
        personalRecords: {
            bench: 185,
            squat: 245,
            deadlift: 285
        },
        followers: [],
        following: []
    }
];

// Simple registration (just adds to demo users)
export const registerUser = async (req, res) => {
    const { email, password, firstname, lastname } = req.body;

    try {
        // Check if user already exists
        const existingUser = demoUsers.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email!" });
        }

        // Create new demo user
        const newUser = {
            _id: Date.now().toString(),
            firstname,
            lastname,
            email,
            password, // Plain text for demo
            age: req.body.age || 25,
            bodyWeight: req.body.bodyWeight || 150,
            height: req.body.height || 70,
            fitnessGoals: req.body.fitnessGoals || "general_fitness",
            experienceLevel: req.body.experienceLevel || "beginner",
            eloRating: 1200,
            about: `Hi! I'm ${firstname} ${lastname}. Welcome to my fitness journey!`,
            profileVisibility: "public",
            workoutStreak: 0,
            totalWorkouts: 0,
            personalRecords: {
                bench: 0,
                squat: 0,
                deadlift: 0
            },
            followers: [],
            following: []
        };

        demoUsers.push(newUser);

        // Create JWT token
        const token = jwt.sign(
            { email: newUser.email, id: newUser._id },
            process.env.JWT_KEY || "demo_secret_key",
            { expiresIn: "1d" }
        );

        // Remove password from response
        const { password: _, ...userResponse } = newUser;

        res.status(200).json({ user: userResponse, token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Simple login (checks demo users)
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user in demo users
        const user = demoUsers.find(u => u.email === email);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Simple password check (plain text for demo)
        if (user.password !== password) {
            return res.status(400).json({ message: "Wrong password" });
        }

        // Create JWT token
        const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JWT_KEY || "demo_secret_key",
            { expiresIn: "1d" }
        );

        // Remove password from response
        const { password: _, ...userResponse } = user;

        res.status(200).json({ user: userResponse, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
};