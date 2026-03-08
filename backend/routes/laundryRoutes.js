import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
    getLaundryRequests, getLaundryRequest, createLaundryRequest,
    updateLaundryRequest, deleteLaundryRequest
} from '../controllers/laundryController.js';

const router = express.Router();

router.use(protect);

router.get('/', getLaundryRequests);
router.get('/:id', getLaundryRequest);
router.post('/', createLaundryRequest);           // any logged-in user
router.put('/:id', adminOnly, updateLaundryRequest);
router.delete('/:id', deleteLaundryRequest);       // controller handles ownership check

export default router;
