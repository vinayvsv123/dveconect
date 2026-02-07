import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  createproject,
  getAllProjects,
  getProjectById
} from '../controllers/projectController.js';

const router = express.Router();

// protected
router.post('/', authMiddleware, createproject);

// public
router.get('/', getAllProjects);
router.get('/:id', getProjectById);

export default router;
