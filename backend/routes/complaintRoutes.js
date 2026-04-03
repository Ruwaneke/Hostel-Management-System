import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import {
    submitComplaint,
    getMyComplaints,
    getComplaintById,
    submitFeedback,
    markNotificationsRead,
    getAllComplaints,
    assignComplaint,
    rejectComplaint,
    updateProgress,
    completeComplaint,
    getReports,
    getSLABreachedComplaints,
    getComplaints,
    updateComplaint,
    deleteComplaint
} from '../controllers/complaintController.js';

const router = express.Router();

router.use(protect);

// Student routes
router.post('/', upload.single('image'), submitComplaint); 
router.get('/my-complaints', getMyComplaints);
router.post('/:complaintId/feedback', submitFeedback);
router.put('/:complaintId/read-notifications', markNotificationsRead);

// Analytics / Admin routes
router.get('/admin/reports', adminOnly, getReports);
router.get('/admin/sla-breached', adminOnly, getSLABreachedComplaints);
router.get('/admin/all', adminOnly, getAllComplaints);
router.put('/:complaintId/assign', adminOnly, assignComplaint);
router.put('/:complaintId/reject', adminOnly, rejectComplaint);

// Staff routes (controller checks role)
router.put('/:complaintId/progress', updateProgress);
router.put('/:complaintId/complete', completeComplaint);

// Common route
router.get('/:complaintId', getComplaintById);

// Fallback for legacy calls
router.get('/legacy/all', adminOnly, getComplaints);
router.put('/legacy/:id', adminOnly, updateComplaint);
router.delete('/legacy/:id', adminOnly, deleteComplaint);

export default router;
