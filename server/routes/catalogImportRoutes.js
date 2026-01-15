import express from 'express';
import { importDavisCatalog } from '../controllers/catalogImportController.js';
import { checkRole, protect } from '../middleware/protect.js';

const router = express.Router();

router.post(
  '/davis',
  protect,
  checkRole('admin'),
  importDavisCatalog
);

export default router;
