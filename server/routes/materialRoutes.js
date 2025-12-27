import express from 'express';
import { getMaterials, createMaterial } from '../controllers/materialController.js';
import { protect, checkRole } from '../middleware/protect.js';

const router = express.Router();

router.get(
  '/',
  protect,
  checkRole('designer'),
  getMaterials
);

router.post(
  '/',
  protect,
  checkRole('admin', 'designer'),
  createMaterial
);

export default router;
