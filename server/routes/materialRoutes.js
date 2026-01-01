import express from 'express';
import { 
  getMaterials,
  createMaterial,
  updateMaterial, 
  deleteMaterial,
} from '../controllers/materialController.js';
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

router.put(
  '/:id',
  protect,
  checkRole('admin'),
  updateMaterial
);

router.delete(
  '/:id',
  protect,
  checkRole('admin'),
  deleteMaterial
);

export default router;
