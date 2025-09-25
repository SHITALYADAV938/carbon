// // server/server.js
// require('dotenv').config(); // load .env first

// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const PDFDocument = require("pdfkit");
// const { OpenAI } = require("openai");

// const Activity = require("./models/Activity"); // your Activity model

// const app = express();
// app.use(bodyParser.json());
// app.use(cors());

// // ===== OpenAI Client =====
// let openai = null;
// if (process.env.OPENAI_API_KEY) {
//   openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
//   console.log("✅ OpenAI API Key Loaded");
// } else {
//   console.log("⚠️ OpenAI API Key NOT FOUND. AI Chatbot disabled");
// }

// // ===== MongoDB =====
// mongoose.connect("mongodb://127.0.0.1:27017/carbontracker")
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch(err => console.log("❌ DB Error:", err));

// // ===== Routes =====

// // Add activity
// app.post("/activities/add", async (req, res) => {
//   try {
//     const { user, transport, distance_km, electricity_kwh, food_emission } = req.body;

//     const transportFactor =
//       transport === "car" ? 0.12 : transport === "bus" ? 0.05 : 0.25;

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

// // Get activities for a user
// app.get("/activities/:user", async (req, res) => {
//   try {
//     const activities = await Activity.find({ user: req.params.user }).sort({ createdAt: -1 });
//     res.json(activities);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Certificate
// app.get("/certificate/:user", async (req, res) => {
//   try {
//     const user = req.params.user;
//     const activities = await Activity.find({ user });
//     const total = activities.reduce((sum, a) => sum + a.carbon_total, 0);

//     const doc = new PDFDocument();
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", `attachment; filename=${user}_certificate.pdf`);

//     doc.fontSize(20).text("🌍 Carbon Footprint Tracker", { align: "center" });
//     doc.moveDown();
//     doc.fontSize(16).text(`Certificate for: ${user}`, { align: "center" });
//     doc.moveDown();
//     doc.fontSize(14).text(`Total Carbon Emission: ${total.toFixed(2)} kg CO₂`, { align: "center" });
//     doc.moveDown();
//     doc.text("Keep reducing your carbon footprint! 🌱", { align: "center" });

//     doc.end();
//     doc.pipe(res);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Chatbot
// app.post("/chat", async (req, res) => {
//   if (!openai) return res.json({ reply: "AI not available. Set OPENAI_API_KEY in .env" });

//   try {
//     const { message } = req.body;

//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: "You are an eco-friendly assistant giving tips to reduce carbon footprint." },
//         { role: "user", content: message },
//       ],
//     });

//     res.json({ reply: response.choices[0].message.content });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "AI Chat failed" });
//   }
// });

// // Test route
// app.get("/", (req, res) => res.send("Server Running"));

// // ===== Start server =====
// const PORT = 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
// server/server.js
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../client/pages")));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Mongoose Schemas
const activitySchema = new mongoose.Schema({
  user: String,
  transportCO2: Number,
  electricityCO2: Number,
  foodCO2: Number,
  date: { type: Date, default: Date.now }
});

const Activity = mongoose.model("Activity", activitySchema);

// Routes
const activityRoutes = require("./routes/activity");
app.use("/api/activity", activityRoutes);

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/index.html"));
});

// Community API
app.get("/api/community", async (req, res) => {
  try {
    const activities = await Activity.find().sort({ date: -1 }).limit(10); // last 10 entries
    const feed = activities.map(a => ({
      user: a.user,
      message: `Travel: ${a.transportCO2} kg, Electricity: ${a.electricityCO2} kg, Food: ${a.foodCO2} kg`
    }));
    res.json(feed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Reports API
app.get("/api/reports", async (req, res) => {
  try {
    const activities = await Activity.find();
    const report = activities.map(a => ({
      date: a.date.toISOString().split("T")[0],
      travelCO2: a.transportCO2,
      electricityCO2: a.electricityCO2,
      foodCO2: a.foodCO2,
      totalCO2: a.transportCO2 + a.electricityCO2 + a.foodCO2
    }));
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Leaderboard API
app.get("/api/leaderboard", async (req, res) => {
  try {
    const leaderboard = await Activity.aggregate([
      {
        $group: {
          _id: "$user",
          totalCO2: { $sum: { $add: ["$transportCO2", "$electricityCO2", "$foodCO2"] } }
        }
      },
      { $sort: { totalCO2: 1 } }, // lowest CO2 first
      { $limit: 10 }
    ]);

    const formatted = leaderboard.map((entry, idx) => ({
      rank: idx + 1,
      user: entry._id,
      totalCO2: entry.totalCO2
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
