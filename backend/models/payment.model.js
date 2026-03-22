import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  serviceType: {
    type: String,
    enum: ["room", "food", "laundry"],
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  paymentMethod: {
    type: String,
    enum: ["card", "bank"],
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "success"],
    default: "success", // for now always success
  },

}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;