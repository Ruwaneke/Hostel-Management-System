import { Laundry } from '../models/Laundry.js';

// GET /api/laundry — admin gets all, user gets own
export const getLaundryRequests = async (req, res) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { student: req.user._id };
        const requests = await Laundry.find(filter)
            .populate('student', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: requests.length, requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/laundry/:id
export const getLaundryRequest = async (req, res) => {
    try {
        const request = await Laundry.findById(req.params.id).populate('student', 'name email');
        if (!request) return res.status(404).json({ success: false, message: 'Laundry request not found' });

        if (req.user.role !== 'admin' && request.student._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        res.status(200).json({ success: true, request });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/laundry — user submits a laundry request
export const createLaundryRequest = async (req, res) => {
    try {
        const { bags, items, pickupDate, notes } = req.body;
        const request = await Laundry.create({
            student: req.user._id,
            bags,
            items,
            pickupDate,
            notes
        });
        await request.populate('student', 'name email');
        res.status(201).json({ success: true, message: 'Laundry request submitted', request });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// PUT /api/laundry/:id — admin updates status
export const updateLaundryRequest = async (req, res) => {
    try {
        if (req.body.status === 'delivered' && !req.body.returnDate) {
            req.body.returnDate = new Date();
        }
        const request = await Laundry.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        }).populate('student', 'name email');
        if (!request) return res.status(404).json({ success: false, message: 'Laundry request not found' });
        res.status(200).json({ success: true, message: 'Laundry request updated', request });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// DELETE /api/laundry/:id — admin or owner (only if still pending)
export const deleteLaundryRequest = async (req, res) => {
    try {
        const request = await Laundry.findById(req.params.id);
        if (!request) return res.status(404).json({ success: false, message: 'Laundry request not found' });

        if (req.user.role !== 'admin' && request.student.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        if (req.user.role !== 'admin' && request.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Cannot cancel a request that is already being processed' });
        }

        await request.deleteOne();
        res.status(200).json({ success: true, message: 'Laundry request cancelled' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
