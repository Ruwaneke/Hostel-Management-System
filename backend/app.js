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

const app = express();

const AllowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()) : ['http://localhost:5173'];

app.use(cors({ origin: AllowedOrigins, credentials:true }));
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/laundry', laundryRoutes);
app.use('/api/complaints', complaintRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;