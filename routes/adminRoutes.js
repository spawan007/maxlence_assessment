import express from 'express';
import {
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controller/adminController.js';

import { authAndAuthorize } from '../middleware/authorize.js';

const router = express.Router();

// Admin-only routes
router.get('/users', authAndAuthorize('admin'), listUsers);
router.get('/users/:id', authAndAuthorize('admin'), getUserById);
router.put('/users/:id', authAndAuthorize('admin'), updateUser);
router.delete('/users/:id', authAndAuthorize('admin'), deleteUser);

export default router;
