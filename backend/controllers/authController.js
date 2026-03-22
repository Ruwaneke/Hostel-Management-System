import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const signToken = (user) =>
    jwt.sign(
        {
            id: user._id,
            userId: user.userId,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

export const register = async (req, res) => {
    try {
        const { name, email, password, role, roomNumber, hostelBlock } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password'
            });
        }

        if (!['admin', 'staff', 'student'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Role must be "admin", "staff", or "student"'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role,
            roomNumber: role === 'student' ? roomNumber : null,
            hostelBlock: role === 'student' ? hostelBlock : null,
            isActive: true
        });

        // Fetch fresh from DB to get userId set by pre-save hook
        const savedUser = await User.findById(user._id).select('-password');

        const token = signToken(savedUser);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: savedUser
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Email already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during registration'
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user and include password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'User account is inactive'
            });
        }

        // Check password match
        const isPasswordMatch = await user.matchPassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = signToken(user);

        // Remove password before sending response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: userResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during login'
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching users'
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if id is ObjectId or userId
        const user = await User.findOne({
            $or: [{ _id: id }, { userId: id }]
        }).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching user'
        });
    }
};

export const getUserByRole = async (req, res) => {
    try {
        const { role } = req.params;

        if (!['admin', 'staff', 'student'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }

        const users = await User.find({ role }).select('-password').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching users'
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, roomNumber, hostelBlock, isActive } = req.body;

        const user = await User.findOne({ $or: [{ _id: id }, { userId: id }] });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update allowed fields
        if (name) user.name = name;
        if (roomNumber) user.roomNumber = roomNumber;
        if (hostelBlock) user.hostelBlock = hostelBlock;
        if (isActive !== undefined) user.isActive = isActive;

        await user.save();

        const updatedUser = await User.findById(user._id).select('-password');

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating user'
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOneAndDelete({
            $or: [{ _id: id }, { userId: id }]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: `User '${user.name}' deleted successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting user'
        });
    }
};
