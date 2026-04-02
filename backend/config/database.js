import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4,
        });

        const dbName = mongoose.connection.name;
        console.log('MongoDB connected Successfully');
        console.log(`Database: ${dbName}`);
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        console.error('Hint: Your Atlas cluster may be paused. Resume it at cloud.mongodb.com');
        // Don't exit — let the server start so you can diagnose via API
        // Routes will return 503 until DB reconnects
    }

    try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected Successfully');



  } catch (error) {
    console.error('MongoDB connection error:', error);
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