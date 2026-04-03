import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRoom, getAllRooms, getRoomById, updateRoom, deleteRoom } from '../controllers/roomController.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../frontend/public/roomImage');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

router.post('/create', upload.single('image'), createRoom);
router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.put('/:id', upload.single('image'), updateRoom);
router.delete('/:id', deleteRoom);

export default router;