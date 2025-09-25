// // server/routes/activity.js
// const express = require("express");
// const router = express.Router();
// const Activity = require("../models/Activity");

// // Add new activity
// router.post("/add", async (req, res) => {
//   try {
//     const { user, transport, distance_km, electricity_kwh, food_emission } = req.body;

//     const transportFactor =
//       transport === "car" ? 0.12 : transport === "bus" ? 0.05 : transport === "flight" ? 0.25 : 0;

//     const carbon_total =
//       distance_km * transportFactor + electricity_kwh * 0.85 + (food_emission || 0);

//     const newActivity = new Activity({
//       user,
//       transport,
//       distance_km,
//       electricity_kwh,
//       food_emission,
//       carbon_total,
//     });

//     await newActivity.save();
//     res.json(newActivity);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ✅ Fetch all activities of a user
// router.get("/:user", async (req, res) => {
//   try {
//     const activities = await Activity.find({ user: req.params.user }).sort({ createdAt: -1 });
//     res.json(activities);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Footprint = require("../models/Footprint");

// Save carbon footprint
router.post("/save", async (req, res) => {
  try {
    const { transport, distance, electricity, total } = req.body;
    const footprint = new Footprint({ transport, distance, electricity, total });
    await footprint.save();
    res.json({ message: "Data saved", footprint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all records
router.get("/all", async (req, res) => {
  try {
    const footprints = await Footprint.find().sort({ createdAt: -1 });
    res.json(footprints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

