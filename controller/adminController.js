import { User } from '../model/User.js';
import Sequelize from 'sequelize';
const Op = Sequelize.Op;
import { formatUserData } from '../util/userFormatter.js';

// List all users with pagination + search
export const listUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    try {
        const { count, rows: users } = await User.findAndCountAll({
            where: {
                email: { [Op.like]: `%${search}%` },
                id: { [Op.ne]: req.user.id },
            },
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['password'] },
        });

        const formattedUsers = users.map(formatUserData);

        return res.status(200).json({
            status: true,
            users: formattedUsers,
            totalUsers: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Something went wrong', error });
    }
};

// View individual user profile
export const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
        });
        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }
        return res.status(200).json({ status: true, user: formatUserData(user), });
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Error retrieving user', error });
    }
};

// Update a user
export const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }

        await user.update(req.body);
        return res.status(200).json({ status: true, message: 'User updated successfully', user: formatUserData(user), });
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Error updating user', error });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }

        await user.destroy();
        return res.status(200).json({ status: true, message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Error deleting user', error });
    }
};
