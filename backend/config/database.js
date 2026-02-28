import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Logs the database name for clarity
        const dbName = mongoose.connection.name;
        console.log('MongoDB connected Successfully');
        console.log(`Database: ${dbName}`);
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

//Connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connecting');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});