import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import laundryRoutes from './routes/laundryRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import mealRoutes from './routes/mealRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
const app = express();

const AllowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()) 
    : [
        'http://localhost:5173', 
        'http://localhost:5174', 
        'http://localhost:3000', 
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000'
      ];

app.use(cors({ 
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (AllowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }, 
    credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended:true}));

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        enviroment: process.env.NODE_ENV || 'development',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        uptime: process.uptime(),
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/laundry', laundryRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/chat', chatRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;