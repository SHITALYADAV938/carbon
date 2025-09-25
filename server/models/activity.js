const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  user: { type: String, required: true },
  transport: { type: String, required: true },
  distance_km: { type: Number, default: 0 },
  electricity_kwh: { type: Number, default: 0 },
  carbon_total: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Activity", ActivitySchema);
