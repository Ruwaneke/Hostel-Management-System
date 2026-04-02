import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import path from 'path';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import laundryRoutes from './routes/laundryRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import mealRoutes from './routes/mealRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import userRoutes from './routes/userRoutes.js'; // For testing only, to be removed later
import chatbotRoutes from './routes/chatbotRoutes.js';

import bookingRoutes from './routes/bookingRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';

const app = express();

const AllowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:5173'];

app.use(helmet({ crossOriginResourcePolicy: false })); // Allow loading images
app.use(cors({ origin: AllowedOrigins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploads folder
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        environment: process.env.NODE_ENV || 'development',
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
app.use('/api/meals', mealRoutes);
app.use('/api/feedback', feedbackRoutes);

app.use('/api/bookings', bookingRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/chatbot', chatbotRoutes);
// ── Error Handling ────────────────────────────────────────────────────────────

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;