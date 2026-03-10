import express from 'express';
import {
    loginUser, registerUser, getProfile, updateProfile, getAllUsers,
    forgotPassword, resetPassword, googleOAuth, githubOAuth
} from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
console.log("User routes loaded");
router.post('/register', registerUser);
router.post('/login', loginUser);

// OAuth routes
router.post('/oauth/google', googleOAuth);
router.get('/oauth/github', githubOAuth);

// Password Reset routes
//router.post('/forgot-password', forgotPassword);
//router.post('/reset-password/:token', resetPassword);

// Profile routes
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

// Get all users for chat
router.get('/', authMiddleware, getAllUsers);

export default router;