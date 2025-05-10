import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser, setRole } from '../controllers/authController.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

router.patch('/set-role', protect, setRole);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, role: req.user.role, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(`${FRONTEND_URL}/dashboard?token=${token}`);
  }
);

router.get('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out (frontend should clear token)' });
});

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/user', protect, (req, res) => {
  res.json(req.user);
});

export default router;
