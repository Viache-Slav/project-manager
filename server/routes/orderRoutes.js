import express from 'express';
import { createOrder, getAllOrders } from '../controllers/orderController.js';
import { protect, checkRole } from '../middleware/protect.js';

const router = express.Router();

router.post('/', createOrder);

router.get( '/', protect, checkRole('admin'), getAllOrders );

export default router;
