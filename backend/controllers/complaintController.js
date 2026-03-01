import Complaint from "../models/Complaint.js";

const addNotification = (complaint, message) => {
    complaint.notifications.push({ message, sentAt: new Date(), read: false });
};

export const submitComplaint = async (req, res) => {
    try {
        const { category, description, imageUrl, priority } = req.body;

        const student = {
            userId: req.user.userId,
            name: req.user.name,
            email: req.user.email,
            roomNumber: req.user.roomNumber || req.body.roomNumber,
            hostelBlock: req.user.hostelBlock || req.body.hostelBlock,
        };

        if (!student.roomNumber || !student.hostelBlock) {
            return res.status(400).json({
                success: false,
                message: "Room number and hostel block are required. Make sure your account has room details.",
            });
        }

        if (!category || !description || !priority) {
            return res.status(400).json({
                success: false,
                message: "category, description, and priority are required.",
            });
        }

        const complaint = new Complaint({
            student,
            category,
            description,
            imageUrl: imageUrl || null,
            priority,
            status: "Pending",
            statusHistory: [{
                status: "Pending",
                changedBy: { userId: req.user.userId, name: req.user.name, role: req.user.role },
                note: "Complaint submitted by student.",
            }],
        });

        addNotification(complaint, "Your complaint has been submitted successfully. We will review it shortly.");
        await complaint.save();

        res.status(201).json({
            success: true,
            message: "Complaint submitted successfully.",
            complaintId: complaint.complaintId,
            data: complaint,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ "student.userId": req.user.userId }).sort({ createdAt: -1 });
        complaints.forEach((c) => c.checkSLA());
        res.json({ success: true, count: complaints.length, data: complaints });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findOne({ complaintId: req.params.complaintId });

        if (!complaint) {
            return res.status(404).json({ success: false, message: "Complaint not found." });
        }

        if (req.user.role === "student" && complaint.student.userId !== req.user.userId) {
            return res.status(403).json({ success: false, message: "Not authorized to view this complaint." });
        }

        complaint.checkSLA();
        res.json({ success: true, data: complaint });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const markNotificationsRead = async (req, res) => {
    try {
        const complaint = await Complaint.findOne({
            complaintId: req.params.complaintId,
            "student.userId": req.user.userId,
        });

        if (!complaint) {
            return res.status(404).json({ success: false, message: "Complaint not found." });
        }

        complaint.notifications.forEach((n) => (n.read = true));
        await complaint.save();
        res.json({ success: true, message: "Notifications marked as read." });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const submitFeedback = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        if (!rating) {
            return res.status(400).json({ success: false, message: "Rating is required." });
        }

        const complaint = await Complaint.findOne({
            complaintId: req.params.complaintId,
            "student.userId": req.user.userId,
        });

        if (!complaint) {
            return res.status(404).json({ success: false, message: "Complaint not found." });
        }

        if (complaint.status !== "Completed") {
            return res.status(400).json({
                success: false,
                message: "Feedback can only be submitted after the complaint is resolved.",
            });
        }

        if (complaint.feedback?.rating) {
            return res.status(400).json({ success: false, message: "Feedback already submitted." });
        }

        complaint.feedback = { rating, comment, submittedAt: new Date() };
        complaint.status = "Closed";
        complaint.statusHistory.push({
            status: "Closed",
            changedBy: { userId: req.user.userId, name: req.user.name, role: req.user.role },
            note: `Student feedback: ${rating}. ${comment || ""}`,
        });

        addNotification(complaint, "Thank you for your feedback! Your complaint is now closed.");
        await complaint.save();

        res.json({ success: true, message: "Feedback submitted. Complaint closed.", data: complaint });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getAllComplaints = async (req, res) => {
    try {
        const { status, priority, category, hostelBlock, page = 1, limit = 20, slaBreached } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (category) filter.category = category;
        if (hostelBlock) filter["student.hostelBlock"] = hostelBlock;
        if (slaBreached === "true") filter["sla.isBreached"] = true;

        if (req.user.role === "staff") {
            filter["assignment.staffId"] = req.user.userId;
        }

        const total = await Complaint.countDocuments(filter);
        const complaints = await Complaint.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        complaints.forEach((c) => c.checkSLA());

        res.json({
            success: true,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            data: complaints,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const assignComplaint = async (req, res) => {
    try {
        const { staffId, staffName, expectedCompletionDate } = req.body;

        if (!staffId || !staffName) {
            return res.status(400).json({ success: false, message: "staffId and staffName are required." });
        }

        const complaint = await Complaint.findOne({ complaintId: req.params.complaintId });

        if (!complaint) {
            return res.status(404).json({ success: false, message: "Complaint not found." });
        }

        if (complaint.status === "Completed" || complaint.status === "Closed") {
            return res.status(400).json({ success: false, message: "Cannot assign a completed or closed complaint." });
        }

        complaint.assignment = {
            staffId,
            staffName,
            assignedBy: req.user.name,
            assignedAt: new Date(),
            expectedCompletionDate: expectedCompletionDate ? new Date(expectedCompletionDate) : null,
        };

        complaint.status = "Assigned";
        complaint.statusHistory.push({
            status: "Assigned",
            changedBy: { userId: req.user.userId, name: req.user.name, role: req.user.role },
            note: `Assigned to ${staffName}.`,
        });

        addNotification(
            complaint,
            `Your complaint has been assigned to ${staffName}. Expected resolution: ${
                expectedCompletionDate ? new Date(expectedCompletionDate).toLocaleDateString() : "TBD"
            }.`
        );

        await complaint.save();
        res.json({ success: true, message: `Complaint assigned to ${staffName}.`, data: complaint });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const rejectComplaint = async (req, res) => {
    try {
        const { reason } = req.body;
        const complaint = await Complaint.findOne({ complaintId: req.params.complaintId });

        if (!complaint) {
            return res.status(404).json({ success: false, message: "Complaint not found." });
        }

        complaint.status = "Rejected";
        complaint.statusHistory.push({
            status: "Rejected",
            changedBy: { userId: req.user.userId, name: req.user.name, role: req.user.role },
            note: reason || "Complaint rejected by admin.",
        });

        addNotification(complaint, `Your complaint has been rejected. Reason: ${reason || "Not specified"}.`);
        await complaint.save();

        res.json({ success: true, message: "Complaint rejected.", data: complaint });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateProgress = async (req, res) => {
    try {
        const complaint = await Complaint.findOne({ complaintId: req.params.complaintId });

        if (!complaint) {
            return res.status(404).json({ success: false, message: "Complaint not found." });
        }

        if (req.user.role === "staff" && complaint.assignment?.staffId !== req.user.userId) {
            return res.status(403).json({ success: false, message: "Not authorized. This complaint is not assigned to you." });
        }

        complaint.status = "In Progress";
        complaint.statusHistory.push({
            status: "In Progress",
            changedBy: { userId: req.user.userId, name: req.user.name, role: req.user.role },
            note: req.body.note || "Work started.",
        });

        addNotification(complaint, "Maintenance work has started on your complaint.");
        await complaint.save();

        res.json({ success: true, message: "Status updated to In Progress.", data: complaint });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const completeComplaint = async (req, res) => {
    try {
        const { workDescription, partsUsed, cost } = req.body;

        if (!workDescription) {
            return res.status(400).json({ success: false, message: "workDescription is required." });
        }

        const complaint = await Complaint.findOne({ complaintId: req.params.complaintId });

        if (!complaint) {
            return res.status(404).json({ success: false, message: "Complaint not found." });
        }

        if (req.user.role === "staff" && complaint.assignment?.staffId !== req.user.userId) {
            return res.status(403).json({ success: false, message: "Not authorized. This complaint is not assigned to you." });
        }

        const completedAt = new Date();
        complaint.resolution = {
            workDescription,
            partsUsed: partsUsed || "",
            cost: cost || 0,
            completedBy: req.user.name,
            completedAt,
        };

        complaint.sla.resolvedWithinSLA = completedAt <= new Date(complaint.sla.deadline);
        complaint.status = "Completed";
        complaint.statusHistory.push({
            status: "Completed",
            changedBy: { userId: req.user.userId, name: req.user.name, role: req.user.role },
            note: `Work completed. ${workDescription}`,
        });

        addNotification(complaint, `Your complaint has been resolved! ${workDescription}. Please provide feedback.`);
        await complaint.save();

        res.json({ success: true, message: "Complaint marked as completed.", data: complaint });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getReports = async (req, res) => {
    try {
        const { startDate, endDate, hostelBlock } = req.query;

        const matchFilter = {};
        if (hostelBlock) matchFilter["student.hostelBlock"] = hostelBlock;
        if (startDate || endDate) {
            matchFilter.createdAt = {};
            if (startDate) matchFilter.createdAt.$gte = new Date(startDate);
            if (endDate) matchFilter.createdAt.$lte = new Date(endDate);
        }

        const [
            totalComplaints, byStatus, byCategory, byPriority,
            slaBreached, resolvedWithinSLA, avgResolutionTime, totalCost, feedbackStats,
        ] = await Promise.all([
            Complaint.countDocuments(matchFilter),
            Complaint.aggregate([{ $match: matchFilter }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
            Complaint.aggregate([{ $match: matchFilter }, { $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
            Complaint.aggregate([{ $match: matchFilter }, { $group: { _id: "$priority", count: { $sum: 1 } } }]),
            Complaint.countDocuments({ ...matchFilter, "sla.isBreached": true }),
            Complaint.countDocuments({ ...matchFilter, "sla.resolvedWithinSLA": true }),
            Complaint.aggregate([
                { $match: { ...matchFilter, status: { $in: ["Completed", "Closed"] }, "resolution.completedAt": { $exists: true } } },
                { $project: { resolutionTime: { $subtract: ["$resolution.completedAt", "$createdAt"] } } },
                { $group: { _id: null, avgTime: { $avg: "$resolutionTime" } } },
            ]),
            Complaint.aggregate([{ $match: matchFilter }, { $group: { _id: null, total: { $sum: "$resolution.cost" } } }]),
            Complaint.aggregate([
                { $match: { ...matchFilter, "feedback.rating": { $exists: true } } },
                { $group: { _id: "$feedback.rating", count: { $sum: 1 } } },
            ]),
        ]);

        const avgTimeHours = ((avgResolutionTime[0]?.avgTime || 0) / (1000 * 60 * 60)).toFixed(2);

        res.json({
            success: true,
            data: {
                totalComplaints, byStatus, byCategory, byPriority,
                sla: {
                    breached: slaBreached,
                    resolvedWithinSLA,
                    complianceRate: totalComplaints > 0 ? `${((resolvedWithinSLA / totalComplaints) * 100).toFixed(1)}%` : "0%",
                },
                avgResolutionTimeHours: Number(avgTimeHours),
                totalMaintenanceCost: totalCost[0]?.total || 0,
                feedbackStats,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getSLABreachedComplaints = async (req, res) => {
    try {
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

        const complaints = await Complaint.find({
            status: { $nin: ["Completed", "Closed", "Rejected"] },
            "sla.deadline": { $lt: now },
        }).sort({ "sla.deadline": 1 });

        const nearDeadline = await Complaint.find({
            status: { $nin: ["Completed", "Closed", "Rejected"] },
            "sla.deadline": { $gte: now, $lte: oneHourLater },
        }).sort({ "sla.deadline": 1 });

        res.json({
            success: true,
            breached: { count: complaints.length, data: complaints },
            nearDeadline: { count: nearDeadline.length, data: nearDeadline },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};