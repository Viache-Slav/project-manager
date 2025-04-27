import express from 'express';
import { getAllUsers, getPendingUsers, approveUser, rejectUser } from '../controllers/adminController.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

router.get('/users', checkRole('admin'), getAllUsers);
router.get('/pending-users', checkRole('admin'), getPendingUsers);
router.patch('/users/:id/approve', checkRole('admin'), approveUser);
router.patch('/users/:id/reject', checkRole('admin'), rejectUser);

export default router;
