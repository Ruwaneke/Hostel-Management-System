import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentEmail: { type: String, required: true },
  studentName: { type: String, required: true },
  
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  roomNumber: { type: String, required: true },
  
  agreedToTerms: { type: Boolean, required: true },
  nicNumber: { type: String, required: true },
  emergencyContactName: { type: String, required: true },
  emergencyContactPhone: { type: String, required: true },
  expectedMoveInDate: { type: Date, required: true },
  specialRequests: { type: String, default: '' },
  
  status: { type: String, default: 'Pending Approval' },

  // INITIAL DEPOSIT TRACKING
  paymentStatus: { type: String, default: 'Unpaid' },
  stripeSessionId: { type: String },

  // MONTHLY RENT TRACKING
  monthlyRentStatus: { type: String, default: 'Paid' }, 
  monthlyStripeSessionId: { type: String }

}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);