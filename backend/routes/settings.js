import express from "express";

const router = express.Router();

// GET settings
router.get("/:userId", async (req, res) => {
  try {
    let settings = await UserSettings.findOne({
      userId: req.params.userId
    });

    if (!settings) {
      settings = await UserSettings.create({
        userId: req.params.userId
      });
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE notifications
router.put("/:userId", async (req, res) => {
  try {
    const updated = await UserSettings.findOneAndUpdate(
      { userId: req.params.userId },
      { notifications: req.body.notifications },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;