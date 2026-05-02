import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // ✅ Save message in DB (important for demo)
    const newMsg = new Contact({ name, email, message });
    await newMsg.save();

    // ✅ Fake email success (no nodemailer needed)
    console.log("📩 New Contact Message:");
    console.log({ name, email, message });

    res.json({ message: "Message sent successfully ✅ (demo mode)" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error ❌" });
  }
});

export default router;