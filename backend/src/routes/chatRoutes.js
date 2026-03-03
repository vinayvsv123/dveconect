import express from 'express';
import { getMessages, sendMessage } from '../controllers/chatController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:userId', authMiddleware, getMessages);
router.post('/', authMiddleware, sendMessage);

export default router;
