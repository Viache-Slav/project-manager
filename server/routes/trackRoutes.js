import express from 'express';
import * as trackController from '../controllers/trackController.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

router.post('/', checkRole('admin'), trackController.createTrack);
router.get('/', checkRole('admin'), trackController.getTracks);

export default router;
