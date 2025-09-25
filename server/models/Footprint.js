const mongoose = require("mongoose");

const footprintSchema = new mongoose.Schema({
  transport: { type: String, required: true },
  distance: { type: Number, required: true },
  electricity: { type: Number, required: true },
  total: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Footprint", footprintSchema);
