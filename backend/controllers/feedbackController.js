import { Feedback } from "../models/Feedback.js";
import { User } from "../models/User.js";

export const submitFeedback = async (req, res) => {
    try {
        const { category, title, description, rating } = req.body;
        
        if (!category || !title || !description || !rating) {
            return res.status(400).json({ success: false, message: "All fields are required (category, title, description, rating)." });
        }

        // The JWT may only contain id/_id; fetch full user from DB if name is missing
        let userRecord = req.user;
        if (!req.user.name) {
            const dbUser = await User.findById(req.user.id || req.user._id);
            if (!dbUser) {
                return res.status(404).json({ success: false, message: "User not found." });
            }
            userRecord = dbUser;
        }

        const student = {
            userId: userRecord.userId || String(userRecord._id || userRecord.id),
            name: userRecord.name,
            email: userRecord.email,
            roomNumber: userRecord.roomNumber || null,
            hostelBlock: userRecord.hostelBlock || null,
        };

        const feedback = new Feedback({
            student,
            category,
            title,
            description,
            rating: Number(rating)
        });

        await feedback.save();

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully.",
            data: feedback
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getMyFeedback = async (req, res) => {
    try {
        const uid = req.user.userId || req.user.id;
        const feedbacks = await Feedback.find({ "student.userId": uid }).sort({ createdAt: -1 });
        res.json({ success: true, count: feedbacks.length, data: feedbacks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getAllFeedback = async (req, res) => {
    try {
        const { category, status, rating } = req.query;
        let filter = {};
        
        if (category && category !== 'All') filter.category = category;
        if (status && status !== 'All') filter.status = status;
        if (rating) filter.rating = Number(rating);

        const feedbacks = await Feedback.find(filter).sort({ createdAt: -1 });
        
        // Aggregate stats
        const stats = await Feedback.aggregate([
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: "$rating" },
                    total: { $sum: 1 },
                    reviewed: { $sum: { $cond: [{ $in: ["$status", ["Reviewed", "Action Taken"]] }, 1, 0] } }
                }
            }
        ]);

        res.json({
            success: true,
            count: feedbacks.length,
            stats: stats.length > 0 ? stats[0] : { avgRating: 0, total: 0, reviewed: 0 },
            data: feedbacks
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateFeedbackStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminResponse } = req.body;

        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ success: false, message: "Feedback not found." });
        }

        if (status) feedback.status = status;
        if (adminResponse !== undefined) feedback.adminResponse = adminResponse;

        await feedback.save();

        res.json({
            success: true,
            message: "Feedback updated successfully.",
            data: feedback
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findByIdAndDelete(id);
        
        if (!feedback) {
            return res.status(404).json({ success: false, message: "Feedback not found." });
        }

        res.json({ success: true, message: "Feedback deleted successfully." });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
