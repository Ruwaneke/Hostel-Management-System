import express from 'express';
import { 
    submitFeedback, 
    getMyFeedback, 
    getAllFeedback, 
    updateFeedbackStatus, 
    deleteFeedback 
} from '../controllers/feedbackController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Student routes
router.post('/', submitFeedback);
router.get('/my-feedback', getMyFeedback);

// Admin/Staff routes
router.use(authorize('admin', 'staff'));
router.route('/')
    .get(getAllFeedback);

router.route('/:id')
    .put(updateFeedbackStatus)
    .delete(deleteFeedback);

export default router;
