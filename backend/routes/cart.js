import express from "express";
import Cart from "../models/Cart.js";
import auth from "../middleware/auth.js";
import Product from "../models/Product.js";

const router = express.Router();


// ================= ADD TO CART =================
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, name, image, price, isCustom } = req.body;

    console.log("👉 ADD TO CART:", productId);

    let cart = await Cart.findOne({ userId });

    // ================= IF CART DOES NOT EXIST =================
    if (!cart) {
      let itemData;

      if (!isCustom) {
        const product = await Product.findById(productId);

        if (!product) {
          console.log("❌ Product NOT FOUND:", productId);
          return res.status(404).json({ error: "Product not found" });
        }

        itemData = {
          productId: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: 1,
          isCustom: false,
        };
      } else {
        itemData = {
          productId: null,
          name,
          image,
          price,
          quantity: 1,
          isCustom: true,
        };
      }

      cart = await Cart.create({
        userId,
        items: [itemData],
      });

      return res.json(cart);
    }

    // ================= IF CART EXISTS =================

    if (!isCustom) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId?.toString() === productId
      );

      if (itemIndex > -1) {
        // ✅ increase quantity
        cart.items[itemIndex].quantity += 1;
      } else {
        const product = await Product.findById(productId);

        if (!product) {
          console.log("❌ Product NOT FOUND:", productId);
          return res.status(404).json({ error: "Product not found" });
        }

        cart.items.push({
          productId: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: 1,
          isCustom: false,
        });
      }
    } else {
      // ✅ custom product always new
      cart.items.push({
        productId: null,
        name,
        image,
        price,
        quantity: 1,
        isCustom: true,
      });
    }

    await cart.save();

    const updatedCart = await Cart.findOne({ userId })
      .populate("items.productId");

    res.json(updatedCart);

  } catch (err) {
    console.error("❌ ADD TO CART ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ================= GET CART =================
router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate("items.productId");

    res.json(cart || { items: [] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= REMOVE ITEM =================
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // ✅ remove by item._id ONLY
    cart.items = cart.items.filter(
      (item) => item._id.toString() !== itemId
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ userId })
      .populate("items.productId");

    res.json(updatedCart);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= UPDATE QUANTITY =================
router.put("/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { quantity } = req.body;
    const itemId = req.params.id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.quantity = quantity < 1 ? 1 : quantity;

    await cart.save();

    const updatedCart = await Cart.findOne({ userId })
      .populate("items.productId");

    res.json(updatedCart);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;