import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'guest',
  },
  serviceType: {
    type: String,
    enum: ['room', 'food', 'laundry'],
    default: 'laundry',
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'success'],
    default: 'success',
  },
  method: {
    type: String, // VISA, Mastercard, PayPal, Cash on Delivery
  },
  bookingData: {
    type: Object,
  },
  cardDetails: {
    cardholderName: String,
    last4:          String,
    expiryMonth:    String,
    expiryYear:     String,
  },
  saveDetails: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
export default Payment;