import express from 'express';
import { handleChat } from '../controllers/chatController.js';

const router = express.Router();

// This handles POST requests from the chatbot UI
router.post('/', handleChat);

export default router;