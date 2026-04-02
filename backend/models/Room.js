import mongoose from 'mongoose';

const roomSchema = mongoose.Schema({
  // Identification
  block: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
  roomNumber: { type: String, required: true, unique: true },
  floorLevel: { type: String, required: true },
  roomType: { type: String, enum: ['Single', 'Double', 'Triple', 'Shared'], required: true },
  designatedGender: { type: String, enum: ['Male', 'Female', 'All'], default: 'All', required: true },

  // Features & Amenities
  airConditioning: { type: String, required: true },
  bathroomType: { type: String, required: true },
  furnishing: [{ type: String }], 
  hasBalcony: { type: Boolean, default: false },
  
  // Furniture Inventory
  bedCount: { type: Number, required: true, default: 0 },
  tableCount: { type: Number, required: true, default: 0 },
  chairCount: { type: Number, required: true, default: 0 },

  // Pricing & Capacity
  monthlyRent: { type: Number, required: true, min: 1 },
  keyMoney: { type: Number, required: true, min: 1 },
  maxCapacity: { type: Number, required: true },
  currentOccupancy: { type: Number, default: 0 },

  // Visuals & Status
  description: { type: String },
  image: { type: String }, 
  status: { type: String, enum: ['Available', 'Full', 'Maintenance'], default: 'Available' },
  display: { type: Boolean, default: true }, 
}, { timestamps: true });

export default mongoose.model('Room', roomSchema);