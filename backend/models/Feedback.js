import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    student: {
        userId: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String },
        roomNumber: { type: String },
        hostelBlock: { type: String }
    },
    category: {
        type: String,
        enum: ['Food & Mess', 'Room Facilities', 'Cleanliness', 'Security', 'General', 'Other'],
        required: true,
        default: 'General'
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Action Taken'],
        default: 'Pending'
    },
    adminResponse: {
        type: String,
        default: ''
    }
}, { timestamps: true });

export const Feedback = mongoose.model('Feedback', feedbackSchema);
