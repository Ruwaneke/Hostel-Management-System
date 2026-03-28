import jwt from "jsonwebtoken";

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
 * Utility: Generate a manual test token (No DB — kept for backward compat)
 * Usage: POST /api/auth/generate-test-token
 * NOTE: Remove in production
 */
export const generateTestToken = (req, res) => {
    // Guard: body must be parsed
    if (!req.body || typeof req.body !== "object") {
        return res.status(400).json({
            success: false,
            message: "Request body missing. Set Content-Type: application/json.",
        });
    }

    const { userId, name, email, role, roomNumber, hostelBlock } = req.body;

    if (!userId || !name || !email || !role) {
        return res.status(400).json({
            success: false,
            message: "userId, name, email, and role are required.",
        });
    }

    const allowedRoles = ["student", "staff", "admin"];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({
            success: false,
            message: `Invalid role. Allowed roles: ${allowedRoles.join(", ")}`,
        });
    }

    const token = jwt.sign(
        { userId, name, email, role, roomNumber, hostelBlock },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    return res.json({
        success: true,
        message: "Test token generated.",
        token,
        user: { userId, name, email, role, roomNumber, hostelBlock },
        note: "Development only. Will be removed when User Management System is integrated.",
    });
};