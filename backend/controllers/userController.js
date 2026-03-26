import jwt from "jsonwebtoken";
import {User} from "../models/User.js";

// ── Helper: Generate Token ─────────────────────────────────────────────────
const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user.userId,
            name: user.name,
            email: user.email,
            role: user.role,
            roomNumber: user.roomNumber || null,
            hostelBlock: user.hostelBlock || null,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );
};

/**
 * @desc    Register a new user & get token
 * @route   POST /api/users/register
 * @access  Public (testing only)
 */
export const registerUser = async (req, res) => {
    try {
        if (!req.body || typeof req.body !== "object") {
            return res.status(400).json({
                success: false,
                message: "Request body missing. Set Content-Type: application/json.",
            });
        }

        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "name, email, and password are required.",
            });
        }

       

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Email already registered. Please login instead.",
            });
        }

        // Create user — pre('save') hook handles userId & password hashing
        const user = await User.create({
            name,
            email,
            password,
            // role will default to 'student' from the schema
            // roomNumber / hostelBlock will default to null
        });

        // Fetch fresh from DB to ensure userId is set by the pre-save hook
        const savedUser = await User.findById(user._id).select("-password");

        const token = generateToken(savedUser);

        return res.status(201).json({
            success: true,
            message: `User registered successfully as ${role}.`,
            token,
            user: {
                userId: savedUser.userId,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
                roomNumber: savedUser.roomNumber,
                hostelBlock: savedUser.hostelBlock,
            },
        });
    } catch (err) {
        // Handle MongoDB duplicate key error
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `${field === "email" ? "Email" : "UserId"} already exists.`,
            });
        }
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Login user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
    try {
        if (!req.body || typeof req.body !== "object") {
            return res.status(400).json({
                success: false,
                message: "Request body missing. Set Content-Type: application/json.",
            });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: "Account is deactivated. Contact admin.",
            });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const token = generateToken(user);

        return res.json({
            success: true,
            message: `Welcome back, ${user.name}!`,
            token,
            user: {
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role,
                roomNumber: user.roomNumber,
                hostelBlock: user.hostelBlock,
            },
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Public (testing only)
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Get single user by userId
 * @route   GET /api/users/:userId
 * @access  Public (testing only)
 */
export const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({
            userId: req.params.userId,
        }).select("-password");

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found." });
        }

        return res.json({ success: true, data: user });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Delete a user (testing cleanup)
 * @route   DELETE /api/users/:userId
 * @access  Public (testing only)
 */
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({
            userId: req.params.userId,
        });

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found." });
        }

        return res.json({
            success: true,
            message: `User '${user.name}' (${user.userId}) deleted successfully.`,
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};