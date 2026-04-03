import mongoose from "mongoose";

const laundrySettingsSchema = new mongoose.Schema({
  // Base Prices per Service Type
  washOnlyPrice: { type: Number, default: 50 },
  washAndDryPrice: { type: Number, default: 80 },
  ironOnlyPrice: { type: Number, default: 40 },
  washAndIronPrice: { type: Number, default: 90 },
  dryCleanPrice: { type: Number, default: 150 },

  // Extra Premium Charges per piece based on Speed
  oneDayExtra: { type: Number, default: 50 },
  twoDayExtra: { type: Number, default: 20 },
  weeklyExtra: { type: Number, default: 0 },

  // Flat Delivery Charge
  deliveryCharge: { type: Number, default: 200 }
});

export default mongoose.model("LaundrySettings", laundrySettingsSchema);