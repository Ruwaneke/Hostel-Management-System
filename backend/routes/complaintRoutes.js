import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
    submitComplaint,
    getMyComplaints,
    getComplaintById,
    markNotificationsRead,
    submitFeedback,
    getAllComplaints,
    assignComplaint,
    rejectComplaint,
    updateProgress,
    completeComplaint,
    getReports,
    getSLABreachedComplaints,
} from "../controllers/complaintController.js";

const router = express.Router();

// ── Reports (Admin only) ──────────────────────────────────────────────────────
router.get(
    "/reports",
    protect,
    authorize("admin"),
    getReports
);

router.get(
    "/sla-breached",
    protect,
    authorize("admin"),
    getSLABreachedComplaints
);

// ── Student routes ────────────────────────────────────────────────────────────
router.post(
    "/",
    protect,
    authorize("student"),
    submitComplaint
);

router.get(
    "/my",
    protect,
    authorize("student"),
    getMyComplaints
);

// ── Admin & Staff routes ──────────────────────────────────────────────────────
router.get(
    "/",
    protect,
    authorize("admin", "staff"),
    getAllComplaints
);

// ── Shared single complaint routes ───────────────────────────────────────────
router.get(
    "/:complaintId",
    protect,
    authorize("student", "staff", "admin"),
    getComplaintById
);

router.patch(
    "/:complaintId/assign",
    protect,
    authorize("admin"),
    assignComplaint
);

router.patch(
    "/:complaintId/reject",
    protect,
    authorize("admin"),
    rejectComplaint
);

router.patch(
    "/:complaintId/progress",
    protect,
    authorize("staff", "admin"),
    updateProgress
);

router.patch(
    "/:complaintId/complete",
    protect,
    authorize("staff", "admin"),
    completeComplaint
);

router.patch(
    "/:complaintId/notifications/read",
    protect,
    authorize("student"),
    markNotificationsRead
);

router.post(
    "/:complaintId/feedback",
    protect,
    authorize("student"),
    submitFeedback
);

export default router;