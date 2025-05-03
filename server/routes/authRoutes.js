import express from 'express';
import passport from 'passport';
import { registerUser, loginUser } from '../controllers/authController.js';
import { setRole } from '../controllers/authController.js';

const router = express.Router();

router.patch('/set-role', setRole);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }

    req.session.destroy(() => {
      res.redirect(`${process.env.FRONTEND_URL}/`);
    });
  });
});

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});


export default router;
