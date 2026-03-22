import { Complaint } from "../models/Complaint.js";
import { User } from "../models/User.js";

/**
 * @desc    Create a new complaint
 * @route   POST /api/complaints
 * @access  Logged-in users (students)
 */
export const createComplaint = async (req, res) => {
    try {
        const { title, description, category, priority } = req.body;
        const userId = req.user.id; // From JWT token

        // Validation
        if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                message: "Please provide title, description, and category"
            });
        }

        if (!['maintenance', 'noise', 'cleanliness', 'food', 'other'].includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category"
            });
        }

        // Verify student exists and is active
        const student = await User.findById(userId);
        if (!student || !student.isActive) {
            return res.status(403).json({
                success: false,
                message: "Invalid or inactive user"
            });
        }

        // Create complaint
        const complaint = await Complaint.create({
            student: userId,
            title,
            description,
            category,
            priority: priority || 'medium',
            status: 'open'
        });

        // Populate student details
        const populatedComplaint = await Complaint.findById(complaint._id)
            .populate('student', 'userId name email roomNumber hostelBlock');

        res.status(201).json({
            success: true,
            message: "Complaint created successfully",
            data: populatedComplaint
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error creating complaint"
        });
    }
};

/**
 * @desc    Get all complaints
 * @route   GET /api/complaints
 * @access  Logged-in users (admins see all, students see their own)
 */
export const getComplaints = async (req, res) => {
    try {
        let complaints;

        // Admins see all complaints, students see only their own
        if (req.user.role === 'admin' || req.user.role === 'staff') {
            complaints = await Complaint.find()
                .populate('student', 'userId name email roomNumber hostelBlock')
                .sort({ createdAt: -1 });
        } else {
            complaints = await Complaint.find({ student: req.user.id })
                .populate('student', 'userId name email roomNumber hostelBlock')
                .sort({ createdAt: -1 });
        }

        res.status(200).json({
            success: true,
            count: complaints.length,
            data: complaints
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching complaints"
        });
    }
};

/**
 * @desc    Get single complaint by ID
 * @route   GET /api/complaints/:id
 * @access  Logged-in users
 */
export const getComplaint = async (req, res) => {
    try {
        const { id } = req.params;

        // Find by complaintId or _id
        const complaint = await Complaint.findOne({
            $or: [{ _id: id }, { complaintId: id }]
        }).populate('student', 'userId name email roomNumber hostelBlock');

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        // Check authorization - students can only view their own
        if (req.user.role === 'student' && complaint.student._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view this complaint"
            });
        }

        res.status(200).json({
            success: true,
            data: complaint
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching complaint"
        });
    }
};

/**
 * @desc    Update complaint status (admin only)
 * @route   PUT /api/complaints/:id
 * @access  Admin/Staff only
 */
export const updateComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminResponse } = req.body;

        // Validate status
        if (status && !['open', 'in-progress', 'resolved'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const complaint = await Complaint.findOne({
            $or: [{ _id: id }, { complaintId: id }]
        });

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        // Update fields
        if (status) complaint.status = status;
        if (adminResponse) complaint.adminResponse = adminResponse;

        // Set resolvedAt when marking as resolved
        if (status === 'resolved' && !complaint.resolvedAt) {
            complaint.resolvedAt = new Date();
        }

        await complaint.save();

        const updatedComplaint = await Complaint.findById(complaint._id)
            .populate('student', 'userId name email roomNumber hostelBlock');

        res.status(200).json({
            success: true,
            message: "Complaint updated successfully",
            data: updatedComplaint
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error updating complaint"
        });
    }
};

/**
 * @desc    Delete complaint (admin only)
 * @route   DELETE /api/complaints/:id
 * @access  Admin only
 */
export const deleteComplaint = async (req, res) => {
    try {
        const { id } = req.params;

        const complaint = await Complaint.findOneAndDelete({
            $or: [{ _id: id }, { complaintId: id }]
        });

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        res.status(200).json({
            success: true,
            message: `Complaint '${complaint.complaintId}' deleted successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error deleting complaint"
        });
    }
};

/**
 * @desc    Get complaints by category
 * @route   GET /api/complaints/category/:category
 * @access  Admin/Staff only
 */
export const getComplaintsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        if (!['maintenance', 'noise', 'cleanliness', 'food', 'other'].includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category"
            });
        }

        const complaints = await Complaint.find({ category })
            .populate('student', 'userId name email roomNumber hostelBlock')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            data: complaints
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching complaints"
        });
    }
};

/**
 * @desc    Get complaints by status
 * @route   GET /api/complaints/status/:status
 * @access  Admin/Staff only
 */
export const getComplaintsByStatus = async (req, res) => {
    try {
        const { status } = req.params;

        if (!['open', 'in-progress', 'resolved'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const complaints = await Complaint.find({ status })
            .populate('student', 'userId name email roomNumber hostelBlock')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            data: complaints
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching complaints"
        });
    }
};
