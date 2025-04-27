export const checkRole = (role) => (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  };
  