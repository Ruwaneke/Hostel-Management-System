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
            userId: String,
            name: String,
            email: String,
            roomNumber: String,
            hostelBlock: String
        },
        title: {
            type: String,
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
            enum: ['Electrical', 'Plumbing', 'Furniture', 'Cleanliness', 'Discipline / Noise', 'Other', 'maintenance', 'noise', 'cleanliness', 'food', 'other'], // include old models to prevent breaking legacy
            required: [true, 'Complaint category is required']
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'low', 'medium', 'high'],
            default: 'Medium'
        },
        status: {
            type: String,
            enum: ['Pending', 'Assigned', 'In Progress', 'Completed', 'Closed', 'Rejected', 'open', 'in-progress', 'resolved'],
            default: 'Pending'
        },
        imageUrl: {
            type: String,
            default: null
        },
        statusHistory: [{
            status: String,
            changedBy: { userId: String, name: String, role: String },
            note: String,
            changedAt: { type: Date, default: Date.now }
        }],
        notifications: [{
            message: String,
            read: { type: Boolean, default: false },
            sentAt: { type: Date, default: Date.now }
        }],
        sla: {
            deadline: Date,
            isBreached: { type: Boolean, default: false },
            resolvedWithinSLA: { type: Boolean, default: null }
        },
        assignment: {
            staffId: String,
            staffName: String,
            assignedBy: String,
            assignedAt: Date,
            expectedCompletionDate: Date
        },
        resolution: {
            workDescription: String,
            partsUsed: String,
            cost: Number,
            completedBy: String,
            completedAt: Date
        },
        feedback: {
            rating: Number, // 1-5
            comment: String,
            submittedAt: Date
        }
    },
    { timestamps: true }
);

// Method to check SLA
complaintSchema.methods.checkSLA = function () {
    if (this.status !== 'Completed' && this.status !== 'Closed' && this.status !== 'Rejected') {
        const now = new Date();
        if (this.sla && this.sla.deadline && now > this.sla.deadline) {
            this.sla.isBreached = true;
            this.save().catch(err => console.error("Error saving SLA breach:", err));
        }
    }
};

// Auto-generate complaintId before saving
complaintSchema.pre('save', async function (next) {
    if (!this.isNew || this.complaintId) ;

    try {
        const categoryPrefix = this.category.substring(0, 3).toUpperCase();
        
        // Find the highest number for this category and increment it
        const lastComplaint = await mongoose.model('Complaint')
            .findOne({ complaintId: new RegExp(`^${categoryPrefix}`) })
            .sort({ complaintId: -1 })
            .select('complaintId');

        let nextNumber = 1;
        if (lastComplaint && lastComplaint.complaintId) {
            const match = lastComplaint.complaintId.match(/\d+$/);
            if (match) {
                nextNumber = parseInt(match[0]) + 1;
            } else {
                nextNumber = parseInt(lastComplaint.complaintId.substring(3)) + 1;
            }
        }

        this.complaintId = `${categoryPrefix}${String(nextNumber).padStart(4, '0')}`;
        
        // Set initial SLA deadline if not set
        if (!this.sla.deadline) {
            let hours = 24; // Medium by default
            const p = (this.priority || '').toLowerCase();
            if (p === 'high') hours = 4;
            else if (p === 'low') hours = 72;
            
            const deadline = new Date();
            deadline.setHours(deadline.getHours() + hours);
            this.sla.deadline = deadline;
        }

    } catch (error) {
        next(error);
    }
});

export const Complaint = mongoose.model('Complaint', complaintSchema);
