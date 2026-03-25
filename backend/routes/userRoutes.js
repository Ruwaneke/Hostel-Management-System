import express from "express";
import {
    getAllUsers,
    getUserById,
    deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// These are for testing/admin purposes only
router.get("/", getAllUsers);
router.get("/:userId", getUserById);
router.delete("/:userId", deleteUser);

export default router;