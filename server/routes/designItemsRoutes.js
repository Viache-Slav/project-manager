import express from 'express';
import { 
  createDesignItem, 
  getDesignItemById, 
  saveCalculation, 
  getDesignItems,
  updateDesignItem,
  deleteDesignItem, deleteDesignItemImage
 } from '../controllers/designItemController.js';
import { protect, checkRole } from '../middleware/protect.js';
import { uploadMemory } from '../middleware/uploadMemory.js';

const router = express.Router();

router.use(protect);

router.post( '/', checkRole('admin'), uploadMemory.array('images', 10), createDesignItem);
router.post( '/:id/calculation', protect, checkRole('designer'), saveCalculation);

router.patch( '/:id', protect, checkRole('designer'), uploadMemory.array('images', 10), updateDesignItem);

router.delete( '/:id', checkRole('designer'), deleteDesignItem);
router.delete( '/:id/images/:imageId', protect, checkRole('designer'), deleteDesignItemImage );

router.get('/', checkRole('designer'), getDesignItems);
router.get('/:id', protect, getDesignItemById);

export default router;
