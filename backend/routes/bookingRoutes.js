import express from 'express';
import { 
  createBookingAndCheckout, 
  verifyPayment, 
  getUserBookingStatus,
  getOccupantsByRoom // Added this for the Admin!
} from '../controllers/bookingController.js';

const router = express.Router();

router.post('/create-checkout', createBookingAndCheckout);
router.post('/verify-payment', verifyPayment);
router.get('/status/:userId', getUserBookingStatus);
router.get('/room/:roomId', getOccupantsByRoom); // Route for the Admin panel

export default router;