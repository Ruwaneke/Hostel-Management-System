import jwt from "jsonwebtoken";

/**
 * Auth middleware for complaint tracking.
 * Currently uses manually provided tokens.
 * In the future, this will integrate with the User Management System.
 *
 * Token payload should contain:
 * { userId, name, email, role, roomNumber, hostelBlock }
 */
export const protect = (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized. No token provided.",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized. Invalid or expired token.",
        });
    }
};

// Restrict to specific roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role '${req.user.role}' is not authorized to access this route.`,
            });
        }
        next();
    };
};

/**
 * Utility: Generate a manual test token
 * Usage: POST /api/auth/generate-test-token
 * NOTE: Remove this in production / when user management is integrated
 */
export const generateTestToken = (req, res) => {
    const { userId, name, email, role, roomNumber, hostelBlock } = req.body;

    const allowedRoles = ["student", "staff", "admin"];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({
            success: false,
            message: `Invalid role. Allowed roles: ${allowedRoles.join(", ")}`,
        });
    }

    if (!userId || !name || !email || !role) {
        return res.status(400).json({
            success: false,
            message: "userId, name, email, and role are required.",
        });
    }

    const token = jwt.sign(
        { userId, name, email, role, roomNumber, hostelBlock },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    res.json({
        success: true,
        message: "Test token generated. Replace with User Management token in production.",
        token,
        user: { userId, name, email, role, roomNumber, hostelBlock },
        note: "This endpoint is for development/testing only. Will be removed when User Management System is integrated.",
    });
};