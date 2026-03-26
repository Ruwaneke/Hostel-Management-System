import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
    getAllFoodItems,
    getFoodItem,
    createFoodItem,
    updateFoodItem,
    deleteFoodItem,
    getFoodItemsByDateAndCategory
} from '../controllers/foodItemController.js';

const router = express.Router();

router.use(protect); // All routes require authentication

// Public routes
router.get('/', getAllFoodItems);
router.get('/search/by-date-category', getFoodItemsByDateAndCategory);
router.get('/:id', getFoodItem);

// Admin only routes
router.post('/', adminOnly, createFoodItem);
router.put('/:id', adminOnly, updateFoodItem);
router.delete('/:id', adminOnly, deleteFoodItem);

export default router;
