import express from 'express';
import { getAllUsers, getPendingUsers, approveUser, rejectUser, getRoles } from '../controllers/adminController.js';
import { protect, checkRole } from '../middleware/protect.js';

const router = express.Router();

router.use(protect);

router.get('/users', checkRole('admin'), getAllUsers);
router.get('/pending-users', checkRole('admin'), getPendingUsers);
router.get('/roles', protect, checkRole('admin'), getRoles);
router.patch('/users/:id/approve', checkRole('admin'), approveUser);
router.patch('/users/:id/reject', checkRole('admin'), rejectUser);

export default router;
