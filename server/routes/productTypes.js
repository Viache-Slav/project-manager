import express from 'express';
import ProductType from '../models/ProductType.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  const types = await ProductType.find().sort({ name: 1 });
  res.json(types);
});

export default router;
