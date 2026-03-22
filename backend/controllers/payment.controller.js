import Payment from "../models/payment.model.js";

// CREATE PAYMENT
export const createPayment = async (req, res) => {
  try {
    const { userId, serviceType, amount, paymentMethod } = req.body;

    // simple validation
    if (!userId || !serviceType || !amount || !paymentMethod) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPayment = new Payment({
      userId,
      serviceType,
      amount,
      paymentMethod,
      status: "success", // simulate success
    });

    await newPayment.save();

    res.status(201).json({
      message: "Payment Successful ✅",
      payment: newPayment,
    });

  } catch (error) {
    res.status(500).json({
      message: "Payment Failed ❌",
      error: error.message,
    });
  }
};

// GET USER PAYMENTS
export const getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;

    const payments = await Payment.find({ userId });

    res.status(200).json(payments);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching payments",
      error: error.message,
    });
  }
};