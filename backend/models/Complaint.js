import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    rating: {
        type: String,
        enum: ["satisfied", "not_satisfied"],
        required: true,
    },
    comment: {
        type: String,
        trim: true,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

const statusHistorySchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
    },
    changedBy: {
        userId: { type: String, required: true },
        name: { type: String, required: true },
        role: { type: String, required: true },
    },
    note: { type: String, trim: true },
    changedAt: {
        type: Date,
        default: Date.now,
    },
});

const complaintSchema = new mongoose.Schema(
    {
        complaintId: {
            type: String,
            unique: true,
        },
        // Student info - manually provided now, auto from user management later
        student: {
            userId: { type: String, required: true },
            name: { type: String, required: true },
            email: { type: String, required: true },
            roomNumber: { type: String, required: true },
            hostelBlock: { type: String, required: true },
        },
        category: {
            type: String,
            enum: [
                "Electrical",
                "Plumbing",
                "Furniture",
                "Cleanliness",
                "Discipline/Noise",
                "Internet",
                "Other",
            ],
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: [10, "Description must be at least 10 characters"],
        },
        imageUrl: {
            type: String,
            default: null,
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            required: true,
        },
        status: {
            type: String,
            enum: [
                "Pending",
                "Assigned",
                "In Progress",
                "Completed",
                "Closed",
                "Rejected",
            ],
            default: "Pending",
        },
        // SLA tracking
        sla: {
            deadline: { type: Date },
            isBreached: { type: Boolean, default: false },
            isNearDeadline: { type: Boolean, default: false },
            resolvedWithinSLA: { type: Boolean, default: null },
        },
        // Assignment details
        assignment: {
            staffId: { type: String, default: null },
            staffName: { type: String, default: null },
            assignedBy: { type: String, default: null },
            assignedAt: { type: Date, default: null },
            expectedCompletionDate: { type: Date, default: null },
        },
        // Work completion details
        resolution: {
            workDescription: { type: String, trim: true },
            partsUsed: { type: String, trim: true },
            cost: { type: Number, default: 0 },
            completedBy: { type: String },
            completedAt: { type: Date },
        },
        // Student feedback
        feedback: feedbackSchema,
        // Status change history
        statusHistory: [statusHistorySchema],
        // Notifications
        notifications: [
            {
                message: { type: String },
                sentAt: { type: Date, default: Date.now },
                read: { type: Boolean, default: false },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Auto-generate Complaint ID before saving
complaintSchema.pre("save", async function (next) {
    if (!this.complaintId) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const count = await mongoose.model("Complaint").countDocuments();
        this.complaintId = `CMP-${year}${month}-${String(count + 1).padStart(4, "0")}`;
    }

    // Set SLA deadline based on priority
    if (!this.sla.deadline) {
        const slaHours = {
            High: parseInt(process.env.SLA_HIGH) || 4,
            Medium: parseInt(process.env.SLA_MEDIUM) || 24,
            Low: parseInt(process.env.SLA_LOW) || 72,
        };
        const deadline = new Date();
        deadline.setHours(deadline.getHours() + slaHours[this.priority]);
        this.sla.deadline = deadline;
    }

    next();
});

// Method to check and update SLA status
complaintSchema.methods.checkSLA = function () {
    if (this.status === "Completed" || this.status === "Closed") return;

    const now = new Date();
    const deadline = new Date(this.sla.deadline);
    const timeToDeadline = deadline - now;
    const oneHourInMs = 60 * 60 * 1000;

    this.sla.isBreached = now > deadline;
    this.sla.isNearDeadline = !this.sla.isBreached && timeToDeadline <= oneHourInMs;
};

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;