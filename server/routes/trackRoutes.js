import express from 'express';
import * as trackController from '../controllers/trackController.js';
import { protect, checkRole } from '../middleware/protect.js';

const router = express.Router();

router.use(protect);

router.post('/', checkRole('admin'), trackController.createTrack);
router.get('/', checkRole('admin'), trackController.getTracks);

export default router;
