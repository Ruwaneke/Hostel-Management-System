import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
    getPayments, getPayment, createPayment, updatePayment, deletePayment
} from '../controllers/paymentController.js';

const router = express.Router();

router.use(protect);

router.get('/', getPayments);
router.get('/:id', getPayment);

// Admin only
router.post('/', adminOnly, createPayment);
router.put('/:id', adminOnly, updatePayment);
router.delete('/:id', adminOnly, deletePayment);

export default router;
