import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  getLaundrySettings, 
  updateLaundrySettings, 
  createLaundryCheckout, 
  verifyLaundryPayment, 
  getStudentLaundryOrders, 
  getAllLaundryOrders, 
  updateLaundryStatus 
} from '../controllers/laundryController.js';

const router = express.Router();

// --- MULTER CONFIGURATION FOR IMAGE UPLOADS ---
// This tells Multer to save files to frontend/public/laundryImage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Navigates from backend/routes out to frontend/public/laundryImage
    cb(null, path.join(process.cwd(), '../frontend/public/laundryImage')); 
  },
  filename: function (req, file, cb) {
    // Renames the file with a timestamp to prevent duplicate names
    cb(null, 'laundry-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Admin Pricing Settings
router.get('/settings', getLaundrySettings);
router.put('/settings', updateLaundrySettings);

// Student Checkout & Payment (Notice the `upload.single('image')` middleware!)
router.post('/create-checkout', upload.single('image'), createLaundryCheckout);
router.post('/verify-payment', verifyLaundryPayment);

// Fetch Orders
router.get('/student/:studentId', getStudentLaundryOrders);
router.get('/all', getAllLaundryOrders);

// Admin Update Status/Notes
router.put('/:id/status', updateLaundryStatus);

export default router;