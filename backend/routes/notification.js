import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

// ===============================
// GET ALL
// ===============================
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// CREATE (ADMIN USE)
// ===============================
router.post("/", async (req, res) => {
  try {
    const { title, message, productId } = req.body;

    const newNotification = new Notification({
      title,
      message,
      productId,
      isRead: false, // ✅ IMPORTANT
    });

    await newNotification.save();

    res.status(201).json(newNotification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// MARK AS READ ✅ FIXED
// ===============================
router.put("/:id", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true, // ✅ FIXED FIELD
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// CLEAR ALL
// ===============================
router.delete("/", async (req, res) => {
  try {
    await Notification.deleteMany();
    res.json({ message: "All notifications cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;