import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Student reference is required']
        },
        amount: {
            type: Number,
            required: [true, 'Payment amount is required']
        },
        type: {
            type: String,
            enum: ['rent', 'meal', 'laundry', 'other'],
            required: [true, 'Payment type is required']
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'overdue'],
            default: 'pending'
        },
        month: {
            type: String, // e.g. "March 2026"
            required: [true, 'Payment month is required']
        },
        dueDate: {
            type: Date,
            required: [true, 'Due date is required']
        },
        paidDate: {
            type: Date
        },
        description: {
            type: String,
            trim: true
        }
    },
    { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);
