import express from 'express';
import { 
  createOrder, getAllOrders, getMyOrders, updateOrderStatus 
} from '../controllers/orderController.js';
import { protect, checkRole } from '../middleware/protect.js';

const router = express.Router();

router.post('/', protect, checkRole('client'), createOrder);

router.get( '/', protect, checkRole('admin'), getAllOrders );
router.get('/my', protect, checkRole('client'), getMyOrders);

router.patch( '/:id/status', protect, checkRole('admin'), updateOrderStatus);

export default router;
