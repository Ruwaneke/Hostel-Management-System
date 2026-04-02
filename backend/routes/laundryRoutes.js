import express from "express";
import {
  createLaundryBooking,
  getLaundryBookings
} from "../controllers/laundryController.js";

const router = express.Router();

// POST booking
router.post("/", createLaundryBooking);

// GET all bookings
router.get("/", getLaundryBookings);

export default router;