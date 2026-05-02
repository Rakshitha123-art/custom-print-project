import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import auth from "../middleware/auth.js";
import upload from "../middleware/uploads.js";


const router = express.Router();

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});



// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user:{
        id:user._id,
      email: user.email,
      isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= GET PROFILE =================
router.get("/profile", auth, async (req, res) => {
  try {
    console.log("GET /profile hit");

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// ================= UPDATE PROFILE =================
router.put("/profile", auth, upload.single("image"), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("USER:", req.user);

    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "No user ID from token" });
    }

    const updateData = {};

    if (req.body.name) updateData.name = req.body.name;
    if (req.body.phone) updateData.phone = req.body.phone;
    if (req.body.email) updateData.email = req.body.email;
    if (req.body.address) updateData.address = req.body.address;
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
});
router.post("/address", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, phone, city, address } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          addresses: { name, phone, city, address }
        }
      },
      { new: true }
    );

    res.json(user.addresses);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error saving address" });
  }
});
router.get("/address", auth, async (req, res) => {
  try {
    console.log("USER ID:", req.user.id);

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user.addresses || []);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching addresses" });
  }
});
router.put("/address/:id", auth, async (req, res) => {
  const user = await User.findById(req.user.id);

  const address = user.addresses.id(req.params.id);

  if (!address) return res.status(404).json({ msg: "Not found" });

  address.name = req.body.name;
  address.phone = req.body.phone;
  address.city = req.body.city;
  address.address = req.body.address;

  await user.save();

  res.json(user.addresses);
});
router.delete("/address/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== req.params.id
    );

    await user.save();

    res.json(user.addresses);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting address" });
  }
});
export default router;