import express from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* ================= DASHBOARD STATS ================= */
router.get("/stats", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.countDocuments();
    const products = await Product.countDocuments();
    const orders = await Order.countDocuments();

    res.json({ users, products, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= ADMIN ORDERS ================= */
router.get("/orders", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete("/orders/:id", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put("/orders/:id", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status } = req.body;

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("userId", "name email")
      .populate("items.productId");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;