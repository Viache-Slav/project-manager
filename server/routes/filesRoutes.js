import express from 'express';
import { getFileById } from '../controllers/fileController.js';

const router = express.Router();

router.get('/:id', getFileById);

export default router;

