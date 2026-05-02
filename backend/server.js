import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import userRoutes from "./routes/userRoutes.js"; // ✅ ADD THIS
import connectDB from "./config/db.js";
import contactRoutes from "./routes/contact.js"; 
import orderRoutes from "./routes/orders.js";// ✅ ADD THIS
import Product from "./models/Product.js"; // ✅ ADD THIS
import cartRoutes from "./routes/cart.js"; // ✅ ADD THIS
import settingsRoutes from "./routes/settings.js";// ✅ ADD THIS
import designRoutes from "./routes/designRoutes.js"; // ✅ ADD THIS
import adminRoutes from "./routes/admin.js";
import paymentRoutes from "./routes/paymentRoutes.js"; // ✅ ADD THIS
import path from "path"; // ✅ for image deletion
import notificationRoutes from "./routes/notification.js";

dotenv.config();
connectDB();

const app = express();

// ✅ CORS FIX (clean)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true })); // ✅ INCREASED LIMIT FOR IMAGES

// ✅ TEST ROUTE
app.get("/test", (req, res) => {
  res.json({ message: "Server is running" });
});

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/orders", orderRoutes);
app.use("/image", express.static(path.join(process.cwd(), "image"))); // ✅ SERVE IMAGES
app.use("/api/cart", cartRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/designs", designRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
// ✅ STATIC
app.use("/uploads", express.static("uploads"));
app.use("/image", (req, res, next) => {
  console.log("Image request:", req.url);
  next();
});
// ADD PRODUCTS (RUN ONCE)
// =====================
app.get("/add-products", async (req, res) => {
  try {
    await Product.deleteMany();

    await Product.insertMany([
      {
        name: "Hand Bag",
        price: 299,
        image: "/image/handbags-2.jpg",
        description: "Stylish handbag",
        category:"handbags"
      },
      {
        name: "Hand Bag",
        price: 299,
        image: "/image/handbags-3.jpg",
        description: "Stylish handbag",
        category:"handbags"
      },
      {
        name: "Hand Bag",
        price: 299,
        image: "/image/handbag-1.jpg",
        description: "Stylish handbag",
        category:"handbags"
      },
      {
        name: "Hand Bag",
        price: 299,
        image: "/image/handbags-4.jpg",
        description: "Stylish handbag",
        category:"handbags"
      },
      {
        name: "Keychain",
        price: 99,
        image: "/image/keychain-2.jpg",
        description: "Custom keychain",
        category:"keychains"
      },
      {
        name: "Keychain",
        price: 99,
        image: "/image/keychain-3.jpg",
        description: "Custom keychain",
        category:"keychains"
      },
      {
        name: "Keychain",
        price: 99,
        image: "/image/keychain-4.jpg",
        description: "Custom keychain",
        category:"keychains"
      },
      {
        name: "Keychain",
        price: 99,
        image: "/image/keychain-1.jpg",
        description: "Custom keychain",
        category:"keychains"
      },
      {
        name: "Kids Jersey",
        price: 199,
        image: "/image/kidsjersy-2.jpg",
        description: "Kids jersey",
         category:"kid-jersies"
      },
      {
        name: "Kids Jersey",
        price: 199,
        image: "/image/kidsjersy-3.jpg",
        description: "Kids jersey",
         category:"kid-jersies"
      },
      {
        name: "Kids Jersey",
        price: 199,
        image: "/image/kidsjersy-4.jpg",
        description: "Kids jersey",
         category:"kid-jersies"
      },
      {
        name: "Kids Jersey",
        price: 199,
        image: "/image/kidsjersy-1.jpg",
        description: "Kids jersey",
         category:"kid-jersies"
      },
      {
        name: "Kids T-Shirt",
        price: 199,
        image: "/image/kidstshirts-2.jpg",
        description: "Kids t-shirt",
         category:"kids-tshirts"
      },
      {
        name: "Kids T-Shirt",
        price: 199,
        image: "/image/kidstshirts-3.jpg",
        description: "Kids t-shirt",
         category:"kids-tshirts"
      },
      {
        name: "Kids T-Shirt",
        price: 199,
        image: "/image/kidstshirts-1.jpg",
        description: "Kids t-shirt",
         category:"kids-tshirts"
      },
      {
        name: "Mug",
        price: 149,
        image: "/image/mug-1.jpg",
        description: "Printed mug",
         category:"mugs"
      },
      {
        name: "Mug",
        price: 149,
        image: "/image/mug-2.jpg",
        description: "Printed mug",
         category:"mugs"
      },
      
      {
        name: "Pillow",
        price: 159,
        image: "/image/pillow-1.jpg",
        description: "Soft pillow",
         category:"pillows"
      },
      {
        name: "Pillow",
        price: 159,
        image: "/image/pillow-2.jpg",
        description: "Soft pillow",
         category:"pillows"
      },
      {
        name: "Pillow",
        price: 159,
        image: "/image/pillow-3.jpg",
        description: "Soft pillow",
         category:"pillows"
      },
      {
        name: "Pillow",
        price: 159,
        image: "/image/pillow-4.jpg",
        description: "Soft pillow",
         category:"pillows"
      },
      
      {
        name: "School Bag",
        price: 199,
        image: "/image/school-bags-1.jpg",
        description: "Durable bag",
         category:"school-bags"
      },
      
      {
        name: "School Bag",
        price: 199,
        image: "/image/school-bags-2.jpg",
        description: "Durable bag",
         category:"school-bags"
      },
      {
        name: "combo",
        price: 199,
        image: "/image/combo-1.jpg",
        description: "pillow with cup",
         category:"combo"
      },
      {
        name: "combo",
        price: 199,
        image: "/image/combo-2.jpg",
        description: "pillow with cup",
         category:"combo"
      },
      {
        name: "combo",
        price: 199,
        image: "/image/combo-3.jpg",
        description: "pillow with cup",
         category:"combo"
      },
      
      {
        name: "combo",
        price: 199,
        image: "/image/combo-4.jpg",
        description: "pillow with cup",
         category:"combo"
      },
      
      {
        name: "couple cups",
        price: 199,
        image: "/image/couplecups-2.jpg",
        description: "attractive naming cups",
         category:"couple-cups"
      },
      {
        name: "couple cups",
        price: 199,
        image: "/image/couplecups-3.jpg",
        description: "attractive naming cups",
         category:"couple-cups"
      },
      {
        name: "couple cups",
        price: 199,
        image: "/image/couplecups-4.jpg",
        description: "attractive naming cups",
         category:"couple-cups"
      },
      {
        name: "couple cups",
        price: 199,
        image: "/image/couplecups-1.jpg",
        description: "attractive naming cups",
         category:"couple-cups"
      },
      {
        name: "couple tshirts",
        price: 199,
        image: "/image/coupletshirts-2.jpg",
        description: "matching matching",
         category:"couple-tshirts"
      },
            {
        name: "couple tshirts",
        price: 199,
        image: "/image/coupletshirts-3.jpg",
        description: "matching matching",
         category:"couple-tshirts"
      },
            {
        name: "couple tshirts",
        price: 199,
        image: "/image/coupletshirts-4.jpg",
        description: "matching matching",
         category:"couple-tshirts"
      },
            {
        name: "couple tshirts",
        price: 199,
        image: "/image/coupletshirts-1.jpg",
        description: "matching matching",
         category:"couple-tshirts"
      }
    ]);

    res.send("Products Added ✅");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));