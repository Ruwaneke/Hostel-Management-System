import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createRoom, getAllRooms, getRoomById, updateRoom, deleteRoom } from '../controllers/roomController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Setup exact path to Frontend public folder
const uploadDir = path.resolve(__dirname, '../../frontend/public/roomImage');
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

router.route('/')
    .get(getAllRooms)
    .post(upload.array('images', 5), createRoom); 

router.route('/:id')
    .get(getRoomById)
    .put(upload.array('images', 5), updateRoom)
    .delete(deleteRoom);

export default router;