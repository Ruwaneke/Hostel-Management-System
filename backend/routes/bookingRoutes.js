import express from 'express';
import { 
  createBookingAndCheckout, 
  verifyPayment, 
  getUserBookingStatus,
  getOccupantsByRoom,
  createMonthlyRentCheckout, // <-- NEW
  verifyMonthlyRent          // <-- NEW
} from '../controllers/bookingController.js';

const router = express.Router();

// Initial Booking
router.post('/create-checkout', createBookingAndCheckout);
router.post('/verify-payment', verifyPayment);

// Dashboard & Admin fetching
router.get('/status/:userId', getUserBookingStatus);
router.get('/room/:roomId', getOccupantsByRoom); 

// Monthly Rent Payments
router.post('/monthly-checkout', createMonthlyRentCheckout); // <-- NEW
router.post('/verify-monthly', verifyMonthlyRent);           // <-- NEW

export default router;