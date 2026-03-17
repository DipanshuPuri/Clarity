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
// Enforces role-based access with hierarchy:
// FOUNDER > ADMIN > MANAGER > MEMBER > INTERN
const roleHierarchy = {
    'INTERN': 1,
    'MEMBER': 2,
    'MANAGER': 3,
    'ADMIN': 4,
    'FOUNDER': 5
};

const authorize = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userRoleLevel = roleHierarchy[req.user.role] || 0;
        const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

        if (userRoleLevel < requiredRoleLevel) {
            return res.status(403).json({
                error: `Forbidden: ${requiredRole} role or higher required`
            });
        }

        next();
    };
};

module.exports = {
    authenticate,
    authorize
};
