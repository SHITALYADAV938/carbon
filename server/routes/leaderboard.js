const express = require("express");
const router = express.Router();
const Footprint = require("../models/Footprint");

// Top 10 users with lowest footprint
router.get("/", async (req, res) => {
  try {
    const data = await Footprint.aggregate([
      { $group: { _id: "$transport", avgFootprint: { $avg: "$total" } } },
      { $sort: { avgFootprint: 1 } },
      { $limit: 10 }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
