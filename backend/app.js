import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import complaintRoutes from './routes/complaintRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

const AllowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:5173'];

app.use(helmet());
app.use(cors({ origin: AllowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        environment: process.env.NODE_ENV || 'development',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        uptime: process.uptime(),
    });
});

// ── Routes ────────────────────────────────────────────────────────────────────
// NOTE: /api/auth is for development token generation only.
// Will be replaced by User Management System integration.
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// ── Error Handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;