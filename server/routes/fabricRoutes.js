import { Router } from 'express';
import {
  getFabricMeta,
  getFabricColors,
  updateCollectionPrice,
} from '../controllers/fabricController.js';
import { protect } from '../middleware/protect.js';

const router = Router();

router.get('/meta', protect, getFabricMeta);
router.get('/colors', getFabricColors);
router.put('/collection-price', protect, updateCollectionPrice);

export default router;
