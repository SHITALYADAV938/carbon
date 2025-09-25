const express = require("express");
const router = express.Router();
const Footprint = require("../models/Footprint");

// Get all reports
router.get("/all", async (req, res) => {
  try {
    const reports = await Footprint.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
