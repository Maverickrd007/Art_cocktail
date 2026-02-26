/**
 * Admin Authorization Middleware.
 * Must be used AFTER auth middleware.
 * Checks if the authenticated user has admin role.
 */
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
};

module.exports = admin;
