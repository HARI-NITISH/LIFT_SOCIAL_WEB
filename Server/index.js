import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import AuthRoute from './Routes/AuthRoute.js';
import UserRoute from './Routes/UserRoute.js';
import PostRoute from './Routes/PostRoute.js';
import UploadRoute from './Routes/UploadRoute.js';
import WorkoutRoute from './Routes/WorkoutRoute.js';
import ChallengeRoute from './Routes/ChallengeRoute.js';


// Routes
const app = express();


// to serve images for public (public folder)
app.use(express.static('public'));
app.use('/images', express.static('images'));


// MiddleWare
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

console.log('Environment variables:');
console.log('PORT:', process.env.PORT);
console.log('MONGO_DB:', process.env.MONGO_DB);
console.log('JWT_KEY:', process.env.JWT_KEY);

mongoose.connect(process.env.MONGO_DB, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => {
    console.log('MongoDB connected successfully');
    app.listen(process.env.PORT, () => console.log(`Server listening at port ${process.env.PORT}`));
}).catch((error) => {
    console.log('MongoDB connection error:', error.message);
    // Start server anyway for development
    app.listen(process.env.PORT || 4000, () => console.log(`Server listening at port ${process.env.PORT || 4000} (without database)`));
})


// uses of routes

app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/post', PostRoute);
app.use('/upload', UploadRoute);
app.use('/workout', WorkoutRoute);
app.use('/challenge', ChallengeRoute);