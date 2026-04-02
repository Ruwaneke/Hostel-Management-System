import express from 'express';
import { getUserInvoices, getAllInvoices } from '../controllers/invoiceController.js';

const router = express.Router();

router.get('/user/:userId', getUserInvoices);
router.get('/', getAllInvoices); // NEW: Admin route to get ALL invoices

export default router;