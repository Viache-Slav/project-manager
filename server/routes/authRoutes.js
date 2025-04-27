import express from 'express';
import passport from 'passport';
import { registerUser, loginUser } from '../controllers/authController.js';
import { checkRole } from '../middleware/checkRole.js';
import { uploadController } from '../controllers/uploadController.js';
import { setRole } from '../controllers/authController.js';

const router = express.Router();

router.patch('/set-role', setRole);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('http://localhost:5173/dashboard');
  }
);

router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }

    req.session.destroy(() => {
      res.redirect('http://localhost:5173/');
    });
  });
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/upload', checkRole('admin'), uploadController);

router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});


export default router;
