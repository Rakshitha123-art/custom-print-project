import express from "express";
import multer from "multer";
import User from "../models/User.js";

import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile
} from "../controllers/userController.js";

const router = express.Router();

// ✅ MULTER CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // ✅ match your server static path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get/profile", getProfile);

// ✅ IMAGE UPLOAD
router.put("/update/profile", upload.single("image"), updateProfile);
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// ✅ EXPORT FIX
export default router;