import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
    getComplaints,
    getComplaint,
    createComplaint,
    updateComplaint,
    deleteComplaint,
    getComplaintsByCategory,
    getComplaintsByStatus
} from '../controllers/complaintController.js';

const router = express.Router();

router.use(protect); // All routes require login

router.get('/', getComplaints);
router.get('/:id', getComplaint);
router.post('/', createComplaint); // Any logged-in user

// Admin/Staff routes
router.put('/:id', adminOnly, updateComplaint);
router.delete('/:id', adminOnly, deleteComplaint);
router.get('/category/:category', adminOnly, getComplaintsByCategory);
router.get('/status/:status', adminOnly, getComplaintsByStatus);

export default router;
