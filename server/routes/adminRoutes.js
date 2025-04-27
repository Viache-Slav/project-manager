import express from 'express';
import { getAllUsers, approveUser, rejectUser } from '../controllers/adminController.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

router.get('/users', checkRole('admin'), getAllUsers);
router.patch('/users/:id/approve', checkRole('admin'), approveUser);
router.patch('/users/:id/reject', checkRole('admin'), rejectUser);

export default router;
