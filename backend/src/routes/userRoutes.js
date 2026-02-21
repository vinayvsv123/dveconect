import express from 'express';
import {loginUser,registerUser} from '../controllers/userController.js';

const router=express.Router();
console.log("User routes loaded");
router.post('/register',registerUser);
router.post('/login',loginUser);

export default router;