import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  studentName: { type: String, required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  roomNumber: { type: String, required: true },
  
  agreedToTerms: { type: Boolean, required: true },

  nicNumber: { 
    type: String, 
    required: [true, 'NIC Number is required'],
    // Regex for Sri Lankan NIC: either 9 digits followed by v/V, or exactly 12 digits
    match: [/^([0-9]{9}[vV]|[0-9]{12})$/, 'Please enter a valid NIC (e.g., 123456789V or 200112345678)']
  },
  emergencyContactName: { type: String, required: true },
  emergencyContactPhone: { 
    type: String, 
    required: [true, 'Emergency contact phone is required'],
    // Regex for exactly 10 digits
    match: [/^[0-9]{10}$/, 'Phone number must be exactly 10 digits']
  },
  expectedMoveInDate: { type: Date, required: true },
  specialRequests: { type: String, default: '' },
  profileImage: { type: String },
  status: { type: String, default: 'Approval' },

  // INITIAL DEPOSIT TRACKING
  paymentStatus: { type: String, default: 'paid' },
  stripeSessionId: { type: String },

  // MONTHLY RENT TRACKING
  monthlyRentStatus: { type: String, default: 'Paid' }, // First month covered by deposit
  monthlyStripeSessionId: { type: String },
  
  // REQUIRED FOR MONTHLY CRON JOB AUTOMATION
  nextRentDueDate: { type: Date }

}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;