const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = (roles = []) => {
  return async (req, res, next) => {
    let token;

    // Extract token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token is missing
    if (!token) {
      console.error('Access denied: No token provided.');
      return res.status(401).json({ success: false, message: 'Not authorized, no token provided.' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from database
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        console.error('Access denied: User not found.');
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      // Check role-based access
      if (roles.length && !roles.includes(req.user.role)) {
        console.error(`Access denied: User role '${req.user.role}' not authorized.`);
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Insufficient permissions.',
        });
      }

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error('Error in protect middleware:', error);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expired. Please log in again.' });
      }

      res.status(401).json({ success: false, message: 'Not authorized, invalid token.' });
    }
  };
};

module.exports = { protect };
