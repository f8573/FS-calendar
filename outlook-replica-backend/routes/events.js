const express = require("express");
const jwt = require("jsonwebtoken");
const Event = require("../models/Event");

const router = express.Router();

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No auth header" });

  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// create
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, start, end, location, description, organizer } = req.body;
    const newEvent = new Event({
      title,
      start,
      end,
      location,
      description,
      organizer,
      user: req.userId
    });
    await newEvent.save();
    res.json(newEvent);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// read (all events for user)
router.get("/", requireAuth, async (req, res) => {
  try {
    const events = await Event.find({ user: req.userId });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// update
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, start, end, location, description, organizer } = req.body;
    const updated = await Event.findOneAndUpdate(
      { _id: id, user: req.userId },
      { $set: { title, start, end, location, description, organizer } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Event not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// delete
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Event.findOneAndDelete({ _id: id, user: req.userId });
    if (!deleted) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
