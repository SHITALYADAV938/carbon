const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Community Post Schema
const postSchema = new mongoose.Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

// Create post
router.post("/add", async (req, res) => {
  try {
    const { username, message } = req.body;
    const newPost = new Post({ username, message });
    await newPost.save();
    res.json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all posts
router.get("/all", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
