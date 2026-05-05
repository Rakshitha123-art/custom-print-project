import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/Payment.js";

const router = express.Router();

// ✅ Create ONE instance globally (IMPORTANT FIX)

// ✅ Create Order
router.post("/create-order", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("KEY:", process.env.RAZORPAY_KEY_ID);
    const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});


    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount missing" });
    }

    const options = {
      amount: Number(amount) * 100, // paise
      currency: "INR",
      receipt: "order_rcptid_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    // ✅ Save initial payment (optional but recommended)
    await Payment.create({
      orderId: order.id,
      amount,
      status: "pending",
    });

    res.json(order);

  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Verify Payment
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {

      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
          paymentId: razorpay_payment_id,
          status: "success",
        }
      );

      return res.json({ success: true });
    }

    res.status(400).json({ success: false });

  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json(err);
  }
});
// ✅ Get all payments
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error("FETCH PAYMENTS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

export default router;