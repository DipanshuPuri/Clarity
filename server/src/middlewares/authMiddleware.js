/**
 * authMiddleware.js
 * ------------------
 * Contains authentication and authorization middleware.
 *
 * - authenticate: verifies JWT and attaches user to req
 * - authorize: enforces role-based access control (RBAC)
 */

const jwt = require('jsonwebtoken');

// =======================
// AUTHENTICATE MIDDLEWARE
// =======================
// Verifies JWT and populates req.user
const authenticate = (req, res, next) => {
    try {
        // 1. Try to read token from HTTP-only cookie
        let token = req.cookies?.token;

        // 2. Fallback to Authorization header (Bearer token)
        if (!token && req.headers.authorization) {
            const parts = req.headers.authorization.split(' ');
            if (parts.length === 2 && parts[0] === 'Bearer') {
                token = parts[1];
            }
        }

        // 3. If no token found → Unauthorized
        if (!token) {
            return res.status(401).json({
                error: 'Unauthorized: No token provided'
            });
        }

        // 4. Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'dev-secret' // dev fallback only
        );

        // 5. Attach decoded payload to request
        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({
            error: 'Unauthorized: Invalid or expired token'
        });
    }
};

// =======================
// AUTHORIZE MIDDLEWARE
// =======================
// Enforces role-based access
const authorize = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // If route requires MANAGER, user must be MANAGER
        if (requiredRole === 'MANAGER' && req.user.role !== 'MANAGER') {
            return res.status(403).json({
                error: 'Forbidden: Manager role required'
            });
        }

        // MEMBER routes are accessible to both MEMBER and MANAGER
        next();
    };
};

module.exports = {
    authenticate,
    authorize
};
