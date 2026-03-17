const prisma = require('../utils/prismaClient');

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, organization, profilePicture } = req.body;
        const userId = req.user.id;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName,
                lastName,
                organization,
                profilePicture
            }
        });

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                role: updatedUser.role,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                organization: updatedUser.organization,
                profilePicture: updatedUser.profilePicture
            }
        });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * List all users in the organization
 */
const listAll = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                organizationId: req.user.organizationId
            },
            select: {
                id: true,
                email: true,
                role: true,
                firstName: true,
                lastName: true,
                position: true,
                department: true,
                profilePicture: true
            }
        });
        res.json(users);
    } catch (err) {
        console.error('List users error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    updateProfile,
    listAll
};
