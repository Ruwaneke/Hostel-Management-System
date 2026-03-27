import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  block: {
    type: String,
    enum: ['A', 'B', 'C', 'D'],
    required: [true, 'Block is required']
  },
  roomNumber: {
    type: Number, 
    required: [true, 'Room number is required'],
    unique: true
  },
  roomType: {
    type: String,
    enum: ['Single', 'Double', 'Triple', 'Shared'],
    required: [true, 'Room type is required']
  },
  capacity: {
    type: Number,
    required: [true, 'Room capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  isAC: {
    type: Boolean,
    required: true,
    default: false
  },
  beds: {
    type: Number,
    required: [true, 'Number of beds is required'],
    min: [1, 'A room must have at least 1 bed']
  },
  tables: {
    type: Number,
    required: [true, 'Number of tables is required'],
    min: [0, 'Cannot be negative']
  },
  chairs: {
    type: Number,
    required: [true, 'Number of chairs is required'],
    min: [0, 'Cannot be negative']
  },
  features: {
    type: [String], 
    default: [] 
  },
  photos: {
    type: [String], 
    required: [true, 'Please upload at least one room photo']
  },
  keyMoney: {
    type: Number,
    required: [true, 'Key money amount is required'],
    min: [0, 'Key money cannot be negative']
  },
  monthlyFee: {
    type: Number,
    required: [true, 'Monthly fee amount is required'],
    min: [0, 'Monthly fee cannot be negative']
  },
  // FIXED: Changed from ObjectId to String to support storing student emails
  bookedStudents: [{
    type: String 
  }]
}, { timestamps: true });

roomSchema.virtual('availableSlots').get(function() {
  return this.capacity - this.bookedStudents.length;
});

roomSchema.set('toJSON', { virtuals: true });

const Room = mongoose.model('Room', roomSchema);
export default Room;