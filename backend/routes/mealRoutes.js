import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
    getMeals, getMeal, createMeal, updateMeal, deleteMeal
} from '../controllers/mealController.js';

const router = express.Router();

router.use(protect); // must be logged in to view meals

router.get('/', getMeals);
router.get('/:id', getMeal);

// Admin only
router.post('/', adminOnly, createMeal);
router.put('/:id', adminOnly, updateMeal);
router.delete('/:id', adminOnly, deleteMeal);

export default router;