import express from "express";
import { createPayment, getUserPayments } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/add", createPayment);
router.get("/user/:userId", getUserPayments);

export default router;