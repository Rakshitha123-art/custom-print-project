import express from "express";
import Product from "../models/Product.js";
import upload from "../middleware/uploads.js";
import auth from "../middleware/auth.js";
import path from "path";
import fs from "fs";
import Notification from "../models/Notification.js";
import mongoose from "mongoose";

const router = express.Router();

const IMAGE_PATH = "/image"; // ✅ single source of truth

// ===============================
// GET ALL PRODUCTS
// ===============================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// ===============================
// GET LATEST PRODUCT (MUST BE BEFORE /:id)
// ===============================
router.get("/latest", async (req, res) => {
  try {
    const product = await Product.findOne().sort({ createdAt: -1 });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching latest product" });
  }
});

// ===============================
// GET SINGLE PRODUCT
// ===============================

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log("REQUESTED ID:", id); // debug

    // ✅ FIX 1: validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);

    // ✅ FIX 2: handle not found
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// ADD PRODUCT
// ===============================
 // ===============================
// ADD PRODUCT ✅ FINAL FIX
// ===============================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-"),
      image: `/image/${req.file.filename}`,
    });

    await product.save();

    // 🔥 CREATE NOTIFICATION (FIXED)
    await Notification.create({
      title: "New Product Added 🛍️",
      message: `${product.name} is now available`,
      productId: product._id,
      isRead: false,
    });

    res.status(201).json(product);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
// ===============================
// UPDATE PRODUCT
// ===============================
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const { name, price, category } = req.body;

    const updateData = {
      name,
      price,
      category,
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`; // ✅ FIXED
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating product" });
  }
});
// ===============================
// DELETE PRODUCT
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ SAFE FILE NAME EXTRACTION
    const filename = product.image?.split("/").pop();

    if (filename) {
      const imagePath = path.resolve("image", filename);

      console.log("DELETE PATH:", imagePath);

      fs.unlink(imagePath, (err) => {
        if (err) {
          console.log("DELETE ERROR:", err.message);
        } else {
          console.log("IMAGE DELETED:", filename);
        }
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;