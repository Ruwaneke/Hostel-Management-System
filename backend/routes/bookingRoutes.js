import express from 'express';
import { createBooking, getMyBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/my-booking/:email', getMyBooking);

export default router;