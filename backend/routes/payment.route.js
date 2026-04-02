import express from 'express';
import { createLaundryPayment, getLaundryPayments } from '../controllers/laundryPaymentController.js';

const router = express.Router();

router.post('/', createLaundryPayment);
router.get('/', getLaundryPayments);

export default router;