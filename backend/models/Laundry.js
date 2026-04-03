import mongoose from "mongoose";

const laundrySchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true, trim: true },
  studentEmail: { type: String, required: true, trim: true },
  studentPhone: { type: String, required: true },
  roomNumber: { type: String, required: true },

  // NEW: Service Type
  serviceType: { 
    type: String, 
    enum: ['Wash Only', 'Wash and Dry', 'Iron Only', 'Wash and Iron', 'Dry Clean'], 
    required: true 
  },
  
  packageType: { type: String, enum: ['One Day Service', 'Two Day Service', 'Weekly Service'], required: true },
  pieces: { type: Number, required: true, min: 1 },
  pricePerPiece: { type: Number, required: true },
  totalAmount: { type: Number, required: true },

  // NEW: Special Instructions from Student
  specialInstructions: { type: String, default: '' },

  image: { type: String, default: null }, 

  status: { type: String, enum: ['Pending Drop-off', 'Washing', 'Ready for Pickup', 'Delivered'], default: 'Pending Drop-off' },
  adminNote: { type: String, default: '' },

  paymentStatus: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
  stripeSessionId: { type: String },
  paidAt: { type: Date }

}, { timestamps: true });

export default mongoose.model("Laundry", laundrySchema);