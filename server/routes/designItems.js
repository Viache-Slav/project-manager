import express from 'express';
import { 
  createDesignItem, 
  getDesignItemById, 
  saveCalculation, 
  getDesignItems,
  updateDesignItem
 } from '../controllers/designItemController.js';
import { protect, checkRole } from '../middleware/protect.js';
import { uploadMemory } from '../middleware/uploadMemory.js';

const router = express.Router();

router.use(protect);

router.post(
  '/',
  checkRole('admin'),
  uploadMemory.array('images', 10),
  createDesignItem
);
router.post(
  '/:id/calculation',
  protect,
  checkRole('designer', 'admin'),
  saveCalculation
);

router.patch(
  '/:id',
  protect,
  checkRole('admin'),
  updateDesignItem
);

router.get('/', checkRole('admin'), getDesignItems);
router.get('/:id', protect, getDesignItemById);

export default router;
