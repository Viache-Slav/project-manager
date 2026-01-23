import express from 'express';
import { 
  createDesignItem, getCalculation, updateExpenses, updateSalePrice,
  getDesignItemById, saveCalculation, getDesignItems, updateDesignItem,
  deleteDesignItem, deleteDesignItemImage, approveCalculation, returnToSubmitted,
  getPublicDesignItems, updateFabrics
 } from '../controllers/designItemController.js';
import { protect, checkRole } from '../middleware/protect.js';
import { uploadMemory } from '../middleware/uploadMemory.js';

const router = express.Router();

router.get('/public/design-items', getPublicDesignItems);

router.use(protect);

router.post( '/', checkRole('admin'), uploadMemory.array('images', 10), createDesignItem);
router.post( '/:id/calculation', protect, checkRole('designer'), saveCalculation);
router.post( '/:id/approve', protect, checkRole('admin'), approveCalculation);
router.put( '/:id/sale-price', protect, checkRole('admin'), updateSalePrice);
router.post( '/:id/return', protect, checkRole('admin'), returnToSubmitted);


router.patch( '/:id', protect, checkRole('designer'), uploadMemory.array('images', 10), updateDesignItem);

router.delete( '/:id', checkRole('designer'), deleteDesignItem);
router.delete( '/:id/images/:imageId', protect, checkRole('designer'), deleteDesignItemImage );

router.get('/', checkRole('designer'), getDesignItems);
router.get('/:id', protect, getDesignItemById);
router.get('/:id/calculation', protect, checkRole('admin'), getCalculation);

router.put( '/:id/expenses', protect, checkRole('admin'), updateExpenses );
router.put('/:id/fabrics', protect, updateFabrics);

export default router;
