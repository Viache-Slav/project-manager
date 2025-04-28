import express from 'express';
import { uploadItem, getProducts } from '../controllers/uploadController.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

router.post('/upload', checkRole('admin'), uploadItem);
router.get('/products', checkRole('admin'), getProducts);

export default router;
