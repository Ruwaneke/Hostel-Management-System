import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true, trim: true },
  floorLevel: { type: String, required: true },
  roomType: { type: String, required: true, enum: ['Single', 'Double', 'Triple', 'Dormitory'] },
  designatedGender: { type: String, required: true, enum: ['Male', 'Female', 'Co-ed', 'Any'] },
  
  // New Inventory Details
  bedCount: { type: Number, required: true, min: 1, default: 1 },
  chairCount: { type: Number, required: true, min: 0, default: 1 },
  
  airConditioning: { type: String, required: true, enum: ['AC', 'Non-AC'] },
  bathroomType: { type: String, required: true, enum: ['Attached', 'Common'] },
  furnishing: [{ type: String }], 
  hasBalcony: { type: Boolean, default: false },
  
  monthlyRent: { type: Number, required: true, min: 0 },
  keyMoney: { type: Number, required: true, min: 0 },
  maxCapacity: { type: Number, required: true, min: 1 },
  currentOccupancy: { type: Number, default: 0 },
  
  description: { type: String, maxLength: 500 },
  images: [{ type: String }], 
  status: { type: String, default: 'Available', enum: ['Available', 'Full', 'Under Maintenance'] },
  
  // Show or Hide this room from students
  display: { type: Boolean, default: true }, 
}, { timestamps: true });

export const Room = mongoose.model('Room', roomSchema);