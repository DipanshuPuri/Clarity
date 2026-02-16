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
const bcrypt = require('bcrypt');
const prisma = require('../utils/prismaClient');

// =======================
// Helper: Generate JWT
// =======================
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
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
        // NOTE: Role is allowed here ONLY for demo/dev purposes
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                role: role === 'MANAGER' ? 'MANAGER' : 'MEMBER',
                firstName,
                lastName,
                organization
            }
        });

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
                organization: user.organization
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

        // Generate JWT
        const token = generateToken(user);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        res.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                organization: user.organization
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
            select: {
                id: true,
                email: true,
                role: true,
                firstName: true,
                lastName: true,
                organization: true
            }
        });

        res.json({ user });
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
