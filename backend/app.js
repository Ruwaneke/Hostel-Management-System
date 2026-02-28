import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { errorHandler, notFound } from './middleware/errorHandler.js';

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

// Add your routes here 



// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;