import express from 'express';
import { loginUser, registerUser, getProfile, updateProfile, getAllUsers } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
console.log("User routes loaded");
router.post('/register', registerUser);
router.post('/login', loginUser);

// Profile routes
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

// Get all users for chat
router.get('/', authMiddleware, getAllUsers);

export default router;