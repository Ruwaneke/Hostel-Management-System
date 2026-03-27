import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { 
    addRoom, 
    getAllRoomsAdmin, 
    getAvailableRoomsStudent, 
    getRoomById, 
    updateRoom, 
    deleteRoom 
} from '../controllers/roomController.js';

const router = express.Router();

const uploadDir = path.join(process.cwd(), '../frontend/public/roomImage');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});
const upload = multer({ storage: storage });

// Admin Routes
router.post('/', upload.array('photos', 5), addRoom); 
router.get('/admin', getAllRoomsAdmin); 

// Student Routes
router.get('/available', getAvailableRoomsStudent); 

// Operations for specific rooms (View, Update, Delete)
router.route('/:id')
    .get(getRoomById)
    .put(upload.array('photos', 5), updateRoom) // Uses multer in case admin uploads new photos
    .delete(deleteRoom);

export default router;