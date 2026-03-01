import Complaint from "../models/Complaint.js";

// ─── Helper ──────────────────────────────────────────────────────────────────

const addNotification = (complaint, message) => {
    complaint.notifications.push({ message, sentAt: new Date(), read: false });
};

// ─── STUDENT ─────────────────────────────────────────────────────────────────

/**
 * @desc    Submit a new complaint
 * @route   POST /api/complaints
 * @access  Student
 */
export const submitComplaint = async (req, res) => {
    const { category, description, imageUrl, priority } = req.body;

    // Use token data for student info (manual now, auto later from user management)
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
            message: "Room number and hostel block are required.",
        });
    }

    const complaint = new Complaint({
        student,
        category,
        description,
        imageUrl: imageUrl || null,
        priority,
        status: "Pending",
        statusHistory: [
            {
                status: "Pending",
                changedBy: {
                    userId: req.user.userId,
                    name: req.user.name,
                    role: req.user.role,
                },
                note: "Complaint submitted by student.",
            },
        ],
    });

    addNotification(complaint, "Your complaint has been submitted successfully. We will review it shortly.");

    await complaint.save();

    res.status(201).json({
        success: true,
        message: "Complaint submitted successfully.",
        complaintId: complaint.complaintId,
        data: complaint,
    });
};

/**
 * @desc    Get complaints for logged-in student
 * @route   GET /api/complaints/my
 * @access  Student
 */
export const getMyComplaints = async (req, res) => {
    const complaints = await Complaint.find({
        "student.userId": req.user.userId,
    }).sort({ createdAt: -1 });

    // Update SLA flags
    complaints.forEach((c) => c.checkSLA());

    res.json({
        success: true,
        count: complaints.length,
        data: complaints,
    });
};

/**
 * @desc    Get single complaint by complaintId (student can only see their own)
 * @route   GET /api/complaints/:complaintId
 * @access  Student, Staff, Admin
 */
export const getComplaintById = async (req, res) => {
    const complaint = await Complaint.findOne({
        complaintId: req.params.complaintId,
    });

    if (!complaint) {
        return res.status(404).json({
            success: false,
            message: "Complaint not found.",
        });
    }

    // Students can only view their own complaints
    if (
        req.user.role === "student" &&
        complaint.student.userId !== req.user.userId
    ) {
        return res.status(403).json({
            success: false,
            message: "Not authorized to view this complaint.",
        });
    }

    complaint.checkSLA();

    res.json({ success: true, data: complaint });
};

/**
 * @desc    Mark notifications as read for a complaint
 * @route   PATCH /api/complaints/:complaintId/notifications/read
 * @access  Student
 */
export const markNotificationsRead = async (req, res) => {
    const complaint = await Complaint.findOne({
        complaintId: req.params.complaintId,
        "student.userId": req.user.userId,
    });

    if (!complaint) {
        return res.status(404).json({
            success: false,
            message: "Complaint not found.",
        });
    }

    complaint.notifications.forEach((n) => (n.read = true));
    await complaint.save();

    res.json({ success: true, message: "Notifications marked as read." });
};

/**
 * @desc    Submit feedback after resolution
 * @route   POST /api/complaints/:complaintId/feedback
 * @access  Student
 */
export const submitFeedback = async (req, res) => {
    const { rating, comment } = req.body;

    const complaint = await Complaint.findOne({
        complaintId: req.params.complaintId,
        "student.userId": req.user.userId,
    });

    if (!complaint) {
        return res.status(404).json({
            success: false,
            message: "Complaint not found.",
        });
    }

    if (complaint.status !== "Completed") {
        return res.status(400).json({
            success: false,
            message: "Feedback can only be submitted after the complaint is resolved.",
        });
    }

    if (complaint.feedback?.rating) {
        return res.status(400).json({
            success: false,
            message: "Feedback already submitted for this complaint.",
        });
    }

    complaint.feedback = { rating, comment, submittedAt: new Date() };
    complaint.status = "Closed";

    complaint.statusHistory.push({
        status: "Closed",
        changedBy: {
            userId: req.user.userId,
            name: req.user.name,
            role: req.user.role,
        },
        note: `Student feedback: ${rating}. ${comment || ""}`,
    });

    addNotification(complaint, "Thank you for your feedback! Your complaint is now closed.");

    await complaint.save();

    res.json({
        success: true,
        message: "Feedback submitted. Complaint closed.",
        data: complaint,
    });
};

// ─── ADMIN ───────────────────────────────────────────────────────────────────

/**
 * @desc    Get all complaints with filters
 * @route   GET /api/complaints
 * @access  Admin, Staff
 */
export const getAllComplaints = async (req, res) => {
    const {
        status,
        priority,
        category,
        hostelBlock,
        page = 1,
        limit = 20,
        slaBreached,
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (hostelBlock) filter["student.hostelBlock"] = hostelBlock;
    if (slaBreached === "true") filter["sla.isBreached"] = true;

    // Staff only see assigned complaints
    if (req.user.role === "staff") {
        filter["assignment.staffId"] = req.user.userId;
    }

    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    // Update SLA flags
    complaints.forEach((c) => c.checkSLA());

    res.json({
        success: true,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        data: complaints,
    });
};

/**
 * @desc    Assign complaint to maintenance staff
 * @route   PATCH /api/complaints/:complaintId/assign
 * @access  Admin
 */
export const assignComplaint = async (req, res) => {
    const { staffId, staffName, expectedCompletionDate } = req.body;

    const complaint = await Complaint.findOne({
        complaintId: req.params.complaintId,
    });

    if (!complaint) {
        return res.status(404).json({ success: false, message: "Complaint not found." });
    }

    if (complaint.status === "Completed" || complaint.status === "Closed") {
        return res.status(400).json({
            success: false,
            message: "Cannot assign a completed or closed complaint.",
        });
    }

    complaint.assignment = {
        staffId,
        staffName,
        assignedBy: req.user.name,
        assignedAt: new Date(),
        expectedCompletionDate: expectedCompletionDate
            ? new Date(expectedCompletionDate)
            : null,
    };

    complaint.status = "Assigned";
    complaint.statusHistory.push({
        status: "Assigned",
        changedBy: {
            userId: req.user.userId,
            name: req.user.name,
            role: req.user.role,
        },
        note: `Assigned to ${staffName}.`,
    });

    addNotification(
        complaint,
        `Your complaint has been assigned to ${staffName}. Expected resolution: ${
            expectedCompletionDate
                ? new Date(expectedCompletionDate).toLocaleDateString()
                : "TBD"
        }.`
    );

    await complaint.save();

    res.json({
        success: true,
        message: `Complaint assigned to ${staffName}.`,
        data: complaint,
    });
};

/**
 * @desc    Reject a complaint
 * @route   PATCH /api/complaints/:complaintId/reject
 * @access  Admin
 */
export const rejectComplaint = async (req, res) => {
    const { reason } = req.body;

    const complaint = await Complaint.findOne({
        complaintId: req.params.complaintId,
    });

    if (!complaint) {
        return res.status(404).json({ success: false, message: "Complaint not found." });
    }

    complaint.status = "Rejected";
    complaint.statusHistory.push({
        status: "Rejected",
        changedBy: {
            userId: req.user.userId,
            name: req.user.name,
            role: req.user.role,
        },
        note: reason || "Complaint rejected by admin.",
    });

    addNotification(
        complaint,
        `Your complaint has been reviewed and rejected. Reason: ${reason || "Not specified"}.`
    );

    await complaint.save();

    res.json({ success: true, message: "Complaint rejected.", data: complaint });
};

// ─── STAFF ───────────────────────────────────────────────────────────────────

/**
 * @desc    Update complaint work progress
 * @route   PATCH /api/complaints/:complaintId/progress
 * @access  Staff
 */
export const updateProgress = async (req, res) => {
    const complaint = await Complaint.findOne({
        complaintId: req.params.complaintId,
    });

    if (!complaint) {
        return res.status(404).json({ success: false, message: "Complaint not found." });
    }

    if (
        req.user.role === "staff" &&
        complaint.assignment.staffId !== req.user.userId
    ) {
        return res.status(403).json({
            success: false,
            message: "Not authorized. This complaint is not assigned to you.",
        });
    }

    complaint.status = "In Progress";
    complaint.statusHistory.push({
        status: "In Progress",
        changedBy: {
            userId: req.user.userId,
            name: req.user.name,
            role: req.user.role,
        },
        note: req.body.note || "Work started.",
    });

    addNotification(
        complaint,
        "Maintenance work has started on your complaint. We will update you upon completion."
    );

    await complaint.save();

    res.json({ success: true, message: "Status updated to In Progress.", data: complaint });
};

/**
 * @desc    Complete a complaint (staff marks work done)
 * @route   PATCH /api/complaints/:complaintId/complete
 * @access  Staff, Admin
 */
export const completeComplaint = async (req, res) => {
    const { workDescription, partsUsed, cost } = req.body;

    const complaint = await Complaint.findOne({
        complaintId: req.params.complaintId,
    });

    if (!complaint) {
        return res.status(404).json({ success: false, message: "Complaint not found." });
    }

    if (
        req.user.role === "staff" &&
        complaint.assignment.staffId !== req.user.userId
    ) {
        return res.status(403).json({
            success: false,
            message: "Not authorized. This complaint is not assigned to you.",
        });
    }

    const completedAt = new Date();

    complaint.resolution = {
        workDescription,
        partsUsed: partsUsed || "",
        cost: cost || 0,
        completedBy: req.user.name,
        completedAt,
    };

    // Check if completed within SLA
    complaint.sla.resolvedWithinSLA = completedAt <= new Date(complaint.sla.deadline);

    complaint.status = "Completed";
    complaint.statusHistory.push({
        status: "Completed",
        changedBy: {
            userId: req.user.userId,
            name: req.user.name,
            role: req.user.role,
        },
        note: `Work completed. ${workDescription}`,
    });

    addNotification(
        complaint,
        `Your complaint has been resolved! ${workDescription}. Please provide feedback to close the complaint.`
    );

    await complaint.save();

    res.json({
        success: true,
        message: "Complaint marked as completed.",
        data: complaint,
    });
};

// ─── REPORTS (Admin) ─────────────────────────────────────────────────────────

/**
 * @desc    Get maintenance reports & analytics
 * @route   GET /api/complaints/reports
 * @access  Admin
 */
export const getReports = async (req, res) => {
    const { startDate, endDate, hostelBlock } = req.query;

    const matchFilter = {};
    if (hostelBlock) matchFilter["student.hostelBlock"] = hostelBlock;
    if (startDate || endDate) {
        matchFilter.createdAt = {};
        if (startDate) matchFilter.createdAt.$gte = new Date(startDate);
        if (endDate) matchFilter.createdAt.$lte = new Date(endDate);
    }

    const [
        totalComplaints,
        byStatus,
        byCategory,
        byPriority,
        slaBreached,
        resolvedWithinSLA,
        avgResolutionTime,
        totalCost,
        feedbackStats,
    ] = await Promise.all([
        Complaint.countDocuments(matchFilter),

        Complaint.aggregate([
            { $match: matchFilter },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),

        Complaint.aggregate([
            { $match: matchFilter },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),

        Complaint.aggregate([
            { $match: matchFilter },
            { $group: { _id: "$priority", count: { $sum: 1 } } },
        ]),

        Complaint.countDocuments({ ...matchFilter, "sla.isBreached": true }),

        Complaint.countDocuments({ ...matchFilter, "sla.resolvedWithinSLA": true }),

        Complaint.aggregate([
            {
                $match: {
                    ...matchFilter,
                    status: { $in: ["Completed", "Closed"] },
                    "resolution.completedAt": { $exists: true },
                },
            },
            {
                $project: {
                    resolutionTime: {
                        $subtract: ["$resolution.completedAt", "$createdAt"],
                    },
                },
            },
            { $group: { _id: null, avgTime: { $avg: "$resolutionTime" } } },
        ]),

        Complaint.aggregate([
            { $match: matchFilter },
            { $group: { _id: null, total: { $sum: "$resolution.cost" } } },
        ]),

        Complaint.aggregate([
            { $match: { ...matchFilter, "feedback.rating": { $exists: true } } },
            { $group: { _id: "$feedback.rating", count: { $sum: 1 } } },
        ]),
    ]);

    const avgTimeMs = avgResolutionTime[0]?.avgTime || 0;
    const avgTimeHours = (avgTimeMs / (1000 * 60 * 60)).toFixed(2);

    res.json({
        success: true,
        data: {
            totalComplaints,
            byStatus,
            byCategory,
            byPriority,
            sla: {
                breached: slaBreached,
                resolvedWithinSLA,
                complianceRate:
                    totalComplaints > 0
                        ? `${((resolvedWithinSLA / totalComplaints) * 100).toFixed(1)}%`
                        : "0%",
            },
            avgResolutionTimeHours: Number(avgTimeHours),
            totalMaintenanceCost: totalCost[0]?.total || 0,
            feedbackStats,
        },
    });
};

/**
 * @desc    Get SLA-breached complaints
 * @route   GET /api/complaints/sla-breached
 * @access  Admin
 */
export const getSLABreachedComplaints = async (req, res) => {
    const now = new Date();

    // Real-time SLA check: find all active complaints past deadline
    const complaints = await Complaint.find({
        status: { $nin: ["Completed", "Closed", "Rejected"] },
        "sla.deadline": { $lt: now },
    }).sort({ "sla.deadline": 1 });

    // Also find near-deadline (within 1 hour)
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const nearDeadline = await Complaint.find({
        status: { $nin: ["Completed", "Closed", "Rejected"] },
        "sla.deadline": { $gte: now, $lte: oneHourLater },
    }).sort({ "sla.deadline": 1 });

    res.json({
        success: true,
        breached: { count: complaints.length, data: complaints },
        nearDeadline: { count: nearDeadline.length, data: nearDeadline },
    });
};