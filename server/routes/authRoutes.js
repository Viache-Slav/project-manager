import express from 'express';
import { registerUser, loginUser, googleLogin } from '../controllers/authController.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);

router.get('/me', protect, (req, res) => res.json(req.user));
router.get('/user', protect, (req, res) => res.json(req.user));

export default router;
