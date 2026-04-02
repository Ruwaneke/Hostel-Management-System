import mongoose from "mongoose";

const laundrySchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  telephone: { type: String, required: true },

  service: { type: String, required: true }, // Washing / Ironing / Both
  pieces: { type: Number, required: true, min: 1, max: 8 },

  date: { type: String, required: true }, // ISO string (YYYY-MM-DD)
  timeSlot: { type: String, required: true },

  location: { type: String, required: true },

  addons: [{ type: String }], // ["Express Service", "Folding Service"]

  totalAmount: { type: Number, required: true, min: 0 },

}, { timestamps: true });

export default mongoose.model("Laundry", laundrySchema);