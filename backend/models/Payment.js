import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  amount:      { type: Number, required: true },
  method:      { type: String, required: true }, // VISA, Mastercard, PayPal, Cash on Delivery
  status:      { type: String, enum: ['Pending', 'Completed', 'Failed', 'Refunded'], default: 'Completed' },
  bookingData: { type: Object },
  cardDetails: {
    cardholderName: String,
    last4:          String,
    expiryMonth:    String,
    expiryYear:     String,
  },
  saveDetails: { type: Boolean, default: false },
}, { timestamps: true });

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
export default Payment;