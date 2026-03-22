import { Payment } from '../models/Payment.js';

// GET /api/payments — admin gets all, user gets own
export const getPayments = async (req, res) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { student: req.user._id };
        const payments = await Payment.find(filter)
            .populate('student', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: payments.length, payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/payments/:id
export const getPayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('student', 'name email');
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

        // Users can only view their own payments
        if (req.user.role !== 'admin' && payment.student._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        res.status(200).json({ success: true, payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/payments — admin only
export const createPayment = async (req, res) => {
    try {
        const { student, amount, type, month, dueDate, description } = req.body;
        const payment = await Payment.create({ student, amount, type, month, dueDate, description });
        await payment.populate('student', 'name email');
        res.status(201).json({ success: true, message: 'Payment created', payment });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// PUT /api/payments/:id — admin only
export const updatePayment = async (req, res) => {
    try {
        // Auto-set paidDate when marking as paid
        if (req.body.status === 'paid' && !req.body.paidDate) {
            req.body.paidDate = new Date();
        }
        const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        }).populate('student', 'name email');
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
        res.status(200).json({ success: true, message: 'Payment updated', payment });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// DELETE /api/payments/:id — admin only
export const deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
        res.status(200).json({ success: true, message: 'Payment deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
