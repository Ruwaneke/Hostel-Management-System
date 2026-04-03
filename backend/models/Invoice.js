import mongoose from 'mongoose';

const invoiceSchema = mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentEmail: { type: String, required: true },
  studentName: { type: String, required: true },
  
  roomNumber: { type: String, required: true },
  description: { type: String, required: true },
  monthName: { type: String }, 
  
  amount: { type: Number, required: true },
  
  status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
  stripeSessionId: { type: String }, 
  paidAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);