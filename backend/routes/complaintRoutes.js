import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
    getComplaints, getComplaint, createComplaint, updateComplaint, deleteComplaint
} from '../controllers/complaintController.js';

const router = express.Router();

router.use(protect);

router.get('/', getComplaints);
router.get('/:id', getComplaint);
router.post('/', createComplaint);                 // any logged-in user
router.put('/:id', adminOnly, updateComplaint);
router.delete('/:id', adminOnly, deleteComplaint);

export default router;
