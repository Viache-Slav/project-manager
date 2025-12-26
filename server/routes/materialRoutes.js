import express from 'express';
import { getMaterials } from '../controllers/materialController.js';
import { protect, checkRole } from '../middleware/protect.js';

const router = express.Router();

router.get(
  '/',
  protect,
  checkRole('designer'),
  getMaterials
);

export default router;
