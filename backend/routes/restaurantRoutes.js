import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
    getAllRestaurants,
    getRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
} from '../controllers/restaurantController.js';

const router = express.Router();

router.use(protect); // All routes require authentication

// Public routes
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurant);

// Admin only routes
router.post('/', adminOnly, createRestaurant);
router.put('/:id', adminOnly, updateRestaurant);
router.delete('/:id', adminOnly, deleteRestaurant);

export default router;
