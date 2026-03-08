import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Student reference is required']
        },
        title: {
            type: String,
            required: [true, 'Complaint title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters']
        },
        description: {
            type: String,
            required: [true, 'Complaint description is required'],
            trim: true
        },
        category: {
            type: String,
            enum: ['maintenance', 'noise', 'cleanliness', 'food', 'other'],
            required: [true, 'Complaint category is required']
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        },
        status: {
            type: String,
            enum: ['open', 'in-progress', 'resolved'],
            default: 'open'
        },
        adminResponse: {
            type: String,
            trim: true
        },
        resolvedAt: {
            type: Date
        }
    },
    { timestamps: true }
);

export const Complaint = mongoose.model('Complaint', complaintSchema);
