import express from 'express';
import complaintController from '../controllers/complaintController.js';

const router = express.Router();

// Routes
router.post('/add', complaintController.createComplaint);
router.get('/all', complaintController.getAllComplaints);
router.get('/:id', complaintController.getComplaintById);
router.put('/:id', complaintController.updateComplaint);

export default router;