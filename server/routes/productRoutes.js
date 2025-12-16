import express from 'express';
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct
} from '../controllers/productController.js';

import { protect, checkRole } from '../middleware/protect.js';

const router = express.Router();

router.post('/', protect, checkRole('admin'), createProduct);
router.get('/', protect, getProducts);
router.patch('/:id', protect, checkRole('admin'), updateProduct);
router.delete('/:id', protect, checkRole('admin'), deleteProduct);

export default router;
