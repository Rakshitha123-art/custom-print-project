import express from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import auth from "../middleware/auth.js";

const router = express.Router();


// ================= PLACE ORDER =================
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const { customer, totalAmount } = req.body;

    console.log("CUSTOMER RECEIVED:", customer);

    const order = await Order.create({
      userId,
      items: cart.items,
      customer: {
        name: customer?.name || "",
        phone: customer?.phone || "",
        address: customer?.address || "",
        city: customer?.city || "",
        pincode: customer?.pincode || "",
      },
      totalAmount,
      status: "Pending",
    });

    cart.items = [];
    await cart.save();

    res.json(order);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


// ================= GET ORDERS =================
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("items.productId")   // clean populate
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.productId")
      .populate("userId", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // optional: ensure user can only see their own order
    if (!req.user.isAdmin && order.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;