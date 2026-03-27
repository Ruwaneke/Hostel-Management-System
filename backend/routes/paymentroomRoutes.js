import express from 'express';
import { 
    createCheckoutSession, 
    verifyPayment, 
    getInvoiceDetails 
} from '../controllers/paymentroomController.js';

const router = express.Router();

// Route to initiate Stripe checkout
router.post('/create-checkout-session', createCheckoutSession);

// Route to verify payment after Stripe redirects back to your site
router.post('/verify-payment', verifyPayment);

// Route to get data for the frontend invoice/receipt
router.get('/invoice/:bookingId', getInvoiceDetails);

export default router;