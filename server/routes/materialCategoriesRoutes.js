import express from 'express';
import {
  getMaterialCategories,
  createMaterialCategory,
} from '../controllers/materialCategoryController.js';
import { protect, checkRole } from '../middleware/protect.js';

const router = express.Router();

router.get('/', protect, getMaterialCategories);

router.post( '/', protect, checkRole('admin', 'designer'), createMaterialCategory);

export default router;
