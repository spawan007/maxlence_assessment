import jwt from 'jsonwebtoken';
import { User } from '../model/User.js';

export const authAndAuthorize = (roles = [], options = { optional: false }) => {
  if (typeof roles === 'string') roles = [roles];

  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      if (options.optional) {
        req.user = null;
        return next();
      }
      return res.status(401).json({ status: false, message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (!user) throw new Error('User not found');

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ status: false, message: 'Forbidden: insufficient permissions' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth error:', error.message);
      if (options.optional) {
        req.user = null;
        return next();
      }
      return res.status(401).json({ status: false, message: 'Unauthorized: Invalid or expired token' });
    }
  };
};
