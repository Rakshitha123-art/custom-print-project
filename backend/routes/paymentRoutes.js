import express from "express";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js"; // ✅ connect with orders (important later)

const router = express.Router();


// ✅ GET ALL PAYMENTS
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching payments" });
  }
});


// ✅ CREATE PAYMENT
router.post("/", async (req, res) => {
  try {
    const { paymentId, amount, status, orderId } = req.body;

    // 🔴 VALIDATION (VERY IMPORTANT)
    if (!paymentId) {
      return res.status(400).json({ message: "Payment ID required" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // ✅ CREATE PAYMENT
    const payment = new Payment({
      paymentId,
      amount: Number(amount),
      status: status || "success",
    });

    await payment.save();

    // ✅ OPTIONAL: UPDATE ORDER STATUS AFTER PAYMENT
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        status: payment.status === "success" ? "paid" : "failed",
      });
    }

    res.json({
      message: "Payment saved successfully",
      payment,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error saving payment" });
  }
});

export default router;