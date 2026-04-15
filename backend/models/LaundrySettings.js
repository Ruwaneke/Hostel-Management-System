import mongoose from "mongoose";

const laundrySettingsSchema = new mongoose.Schema({
  // Base Prices per Service Type
  washOnlyPrice: { type: Number, min: 0 },
  washAndDryPrice: { type: Number, min: 0 },
  ironOnlyPrice: { type: Number, min: 0 },
  washAndIronPrice: { type: Number, min: 0 },
  dryCleanPrice: { type: Number, min: 0 },

  // Extra Premium Charges per piece based on Speed
  oneDayExtra: { type: Number, min: 0 },
  twoDayExtra: { type: Number, min: 0 },
  weeklyExtra: { type: Number, min: 0 },

  // Flat Delivery Charge
  deliveryCharge: { type: Number, min: 0 }
});

export default mongoose.model("LaundrySettings", laundrySettingsSchema);