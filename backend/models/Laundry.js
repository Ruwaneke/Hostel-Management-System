import mongoose from 'mongoose';

const laundrySchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Student reference is required']
        },
        bags: {
            type: Number,
            required: [true, 'Number of bags is required'],
            min: [1, 'At least 1 bag is required'],
            max: [5, 'Maximum 5 bags per request']
        },
        items: {
            type: String,
            trim: true
        },
        pickupDate: {
            type: Date,
            required: [true, 'Pickup date is required']
        },
        returnDate: {
            type: Date
        },
        status: {
            type: String,
            enum: ['pending', 'picked-up', 'washing', 'ready', 'delivered'],
            default: 'pending'
        },
        notes: {
            type: String,
            trim: true
        }
    },
    { timestamps: true }
);

export const Laundry = mongoose.model('Laundry', laundrySchema);
