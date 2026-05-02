import express from "express";
import Design from "../models/Design.js";

const router = express.Router();

// 💾 SAVE DESIGN
router.post("/", async (req, res) => {
  try {
    console.log("🔥 REQUEST BODY:", req.body);

    const {
      userId,
      productId,
      designData,
      previewImage,
      previewImageLarge, // ✅ ADD THIS
    } = req.body;

    if (!designData || !previewImage) {
      return res.status(400).json({
        message: "Missing designData or previewImage",
      });
    }

    const design = await Design.create({
      userId: userId || "guest",
      productId: productId || "default",
      designData,

      // ✅ SAVE BOTH
      previewImage,
      previewImageLarge,
    });

    res.status(201).json(design);
  } catch (err) {
    console.log("❌ DESIGN SAVE ERROR:", err);

    res.status(500).json({
      message: "Design save failed",
      error: err.message,
    });
  }
});


// 📦 GET SINGLE DESIGN
router.get("/single/:id", async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    res.json(design);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📥 GET USER DESIGNS
router.get("/user/:userId", async (req, res) => {
  try {
    const designs = await Design.find({ userId: req.params.userId });
    res.json(designs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🗑 DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Design.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;