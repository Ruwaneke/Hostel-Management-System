import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
    getRooms, getRoom, createRoom, updateRoom, deleteRoom,
    assignRoom, vacateRoom
} from '../controllers/roomController.js';

const router = express.Router();

router.use(protect); // all room routes require login

router.get('/', getRooms);
router.get('/:id', getRoom);

// Admin only
router.post('/', adminOnly, createRoom);
router.put('/:id', adminOnly, updateRoom);
router.delete('/:id', adminOnly, deleteRoom);
router.post('/:id/assign', adminOnly, assignRoom);
router.post('/:id/vacate', adminOnly, vacateRoom);

export default router;
