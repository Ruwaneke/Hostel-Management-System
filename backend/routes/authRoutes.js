import express from "express";
import { generateTestToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /api/auth/generate-test-token
 * Manually generate a JWT for testing until
 * User Management System is integrated.
 *
 * Body: { userId, name, email, role, roomNumber, hostelBlock }
 * Roles: student | staff | admin
 */
router.post("/generate-test-token", generateTestToken);

export default router;