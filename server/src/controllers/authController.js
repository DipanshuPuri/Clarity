/**
 * authController.js
 * ------------------
 * Handles authentication business logic:
 * - User signup
 * - User login
 * - Logout
 * - Get current user
 *
 * This file contains NO routing logic.
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../utils/prismaClient');

// =======================
// Helper: Generate JWT
// =======================
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
            organizationId: user.organizationId
        },
        process.env.JWT_SECRET || 'dev-secret', // OK for local dev ONLY
        { expiresIn: '1d' }
    );
};

// =======================
// SIGNUP
// =======================
const signup = async (req, res) => {
    try {
        const { email, password, role, firstName, lastName, organization } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                error: 'User already exists'
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        // Valid roles: INTERN, MEMBER, MANAGER, ADMIN, FOUNDER
        const validRoles = ['INTERN', 'MEMBER', 'MANAGER', 'ADMIN', 'FOUNDER'];

        // Fix: Ensure role is uppercase before checking
        const roleUpper = role ? role.toUpperCase() : 'MEMBER';
        const userRole = validRoles.includes(roleUpper) ? roleUpper : 'MEMBER';

        let orgId = null;
        const { orgDetails } = req.body;

        if (orgDetails && orgDetails.name) {
            const org = await prisma.organization.create({
                data: {
                    name: orgDetails.name,
                    industry: orgDetails.industry,
                    size: orgDetails.size,
                    description: orgDetails.description,
                    website: orgDetails.website
                }
            });
            orgId = org.id;
        }

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                role: userRole,
                firstName,
                lastName,
                organizationId: orgId
            },
            include: {
                organization: true
            }
        });

        // AUTO-SEEDER: If a new organization was created, fill it with data
        if (orgId) {
            // We run this asynchronously so we don't block the response
            const { seedNewOrganization } = require('../services/seederService');
            seedNewOrganization(orgId, user.id).catch(err => {
                console.error('Background seeding failed:', err);
            });
        }

        // Generate JWT
        const token = generateToken(user);

        // Set JWT as HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        // Respond without sensitive data
        res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                organization: user.organization ? user.organization.name : null,
                organizationFull: user.organization
            }
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// =======================
// LOGIN
// =======================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // Invalid credentials
        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        // Fetch user with organization
        const userWithOrg = await prisma.user.findUnique({
            where: { id: user.id },
            include: { organization: true }
        });

        // Generate JWT
        const token = generateToken(userWithOrg);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        res.json({
            user: {
                id: userWithOrg.id,
                email: userWithOrg.email,
                role: userWithOrg.role,
                firstName: userWithOrg.firstName,
                lastName: userWithOrg.lastName,
                organization: userWithOrg.organization ? userWithOrg.organization.name : null,
                organizationFull: userWithOrg.organization,
                profilePicture: userWithOrg.profilePicture
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// =======================
// LOGOUT
// =======================
const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

// =======================
// GET CURRENT USER
// =======================
const me = async (req, res) => {
    try {
        // req.user is set by authenticate middleware
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: {
                organization: true
            }
        });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        res.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                organization: user.organization ? user.organization.name : null,
                organizationFull: user.organization,
                profilePicture: user.profilePicture
            }
        });
    } catch (err) {
        console.error('Me error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    signup,
    login,
    logout,
    me
};
