import express from "express";
import {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

/**
 * NOTE: All routes here are for TESTING only.
 * Will be replaced by User Management System integration.
 *
 * POST   /api/users/register  → Register & get token
 * POST   /api/users/login     → Login & get token
 * GET    /api/users           → List all users
 * GET    /api/users/:userId   → Get single user
 * DELETE /api/users/:userId   → Delete user (cleanup)
 */

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);
router.get("/:userId", getUserById);
router.delete("/:userId", deleteUser);

export default router;