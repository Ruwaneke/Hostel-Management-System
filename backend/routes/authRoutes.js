import express from 'express';
import {
    register,
    login,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/users', protect, getAllUsers);
router.get('/users/:id', protect, getUserById);
router.put('/users/:id', protect, updateUser);
router.delete('/users/:id', protect, adminOnly, deleteUser);

export default router;
