import { Complaint } from '../models/Complaint.js';

// GET /api/complaints — admin gets all, user gets own
export const getComplaints = async (req, res) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { student: req.user._id };
        const complaints = await Complaint.find(filter)
            .populate('student', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: complaints.length, complaints });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/complaints/:id
export const getComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id).populate('student', 'name email');
        if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

        if (req.user.role !== 'admin' && complaint.student._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        res.status(200).json({ success: true, complaint });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/complaints — any authenticated user
export const createComplaint = async (req, res) => {
    try {
        const { title, description, category, priority } = req.body;
        const complaint = await Complaint.create({
            student: req.user._id,
            title,
            description,
            category,
            priority
        });
        await complaint.populate('student', 'name email');
        res.status(201).json({ success: true, message: 'Complaint submitted', complaint });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// PUT /api/complaints/:id — admin responds / updates status
export const updateComplaint = async (req, res) => {
    try {
        if (req.body.status === 'resolved' && !req.body.resolvedAt) {
            req.body.resolvedAt = new Date();
        }
        const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        }).populate('student', 'name email');
        if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
        res.status(200).json({ success: true, message: 'Complaint updated', complaint });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// DELETE /api/complaints/:id — admin only
export const deleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findByIdAndDelete(req.params.id);
        if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
        res.status(200).json({ success: true, message: 'Complaint deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
