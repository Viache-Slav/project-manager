import express from 'express';
import passport from 'passport';
import { registerUser, loginUser } from '../controllers/authController.js';
import { setRole } from '../controllers/authController.js';

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

router.patch('/set-role', setRole);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(`${FRONTEND_URL}/dashboard`);
  }
);

router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ message: 'Logout error' });
    }

    req.session.destroy(() => {
      res.clearCookie('connect.sid', {
        path: '/',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
      });

      res.redirect(`${FRONTEND_URL}/`);
    });
  });
});

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/user', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.json(req.user);
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});


export default router;
