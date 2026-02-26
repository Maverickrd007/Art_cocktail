const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * JWT Authentication Middleware.
 * Verifies the token from the Authorization header
 * and attaches the user object to req.user.
 */
const auth = async (req, res, next) => {
    try {
        // Extract token from "Bearer <token>" header
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user and attach to request
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Token is invalid. User not found.' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is invalid or expired.' });
    }
};

module.exports = auth;
