import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
    {
        complaintId: {
            type: String,
            unique: true,
            sparse: true,
            trim: true
        },
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

// Auto-generate complaintId before saving
complaintSchema.pre('save', async function (next) {
    if (!this.isNew || this.complaintId);

    try {
        const categoryPrefix = this.category.substring(0, 3).toUpperCase();
        
        // Find the highest number for this category and increment it
        const lastComplaint = await mongoose.model('Complaint')
            .findOne({ complaintId: new RegExp(`^${categoryPrefix}`) })
            .sort({ complaintId: -1 })
            .select('complaintId');

        let nextNumber = 1;
        if (lastComplaint && lastComplaint.complaintId) {
            const lastNumber = parseInt(lastComplaint.complaintId.substring(3));
            nextNumber = lastNumber + 1;
        }

        this.complaintId = `${categoryPrefix}${String(nextNumber).padStart(4, '0')}`;
    } catch (error) {
        next(error);
    }
});

export const Complaint = mongoose.model('Complaint', complaintSchema);
