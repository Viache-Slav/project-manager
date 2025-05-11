import express from 'express';
import { uploadItem, getProducts } from '../controllers/uploadController.js';
import { protect, checkRole } from '../middleware/protect.js';

const router = express.Router();

router.use(protect);

router.post('/upload', checkRole('admin'), uploadItem);
router.get('/products', checkRole('admin'), getProducts);

export default router;
