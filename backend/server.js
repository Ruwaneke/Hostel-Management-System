import mongoose from "mongoose";
import http from "http";
import app from './app.js';
import { connectDB } from "./config/database.js";
import { startSLAJob } from "./jobs/slaJob.js";


const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const startServer = async () => {
    try {
        await connectDB();
        startSLAJob(); // Initialize background cron jobs

        server.listen((PORT), () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        })
    } catch (error) {
        console.log('Failed to start server: ', error);
        process.exit(1);
    }
}

startServer();

server.on('error', (error) => {
    console.error('Server error:', error);
});