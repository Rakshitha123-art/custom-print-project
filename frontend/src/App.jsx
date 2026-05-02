import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import PlaceOrder from "./pages/PlaceOrder";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import Wishlist from "./pages/Wishlist";
import Address from "./pages/Address";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Customize from "./pages/Customize";
import MyDesigns from "./pages/MyDesigns";
import Notification from "./pages/Notification";
import TrackOrder from "./pages/TrackOrder";
// Admin
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";
import AdminOrders from "./pages/AdminOrders";
import AdminPayments from "./pages/AdminPayments";

// Guards
import AdminRoute from "./AdminRoute";

// Components
import Navbar from "./components/Navbar";
import Welcome from "./pages/Welcome";
import { Toaster } from "react-hot-toast";

const App = () => {
  const [showWelcome, setShowWelcome] = useState(
    localStorage.getItem("showWelcome") === "true"
  );

  const location = useLocation();

  const isLoggedIn = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <>
      <Toaster position="top-right" />

      {showWelcome ? (
        <Welcome
          onFinish={() => {
            setShowWelcome(false);
            localStorage.removeItem("showWelcome");
          }}
        />
      ) : (
        <>
          {/* Hide navbar in admin/login/register */}
          {!(location.pathname.startsWith("/admin") ||
            ["/login", "/register"].includes(location.pathname)) && <Navbar />}

          <Routes>

            {/* ================= USER ROUTES ================= */}

            <Route
              path="/"
              element={
                isLoggedIn ? (
                  role === "admin" ? (
                    <Navigate to="/admin" />
                  ) : (
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/collection" element={<ProtectedRoute><Collection /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/placeOrder" element={<ProtectedRoute><PlaceOrder /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/setting" element={<ProtectedRoute><Setting /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/address" element={<ProtectedRoute><Address /></ProtectedRoute>} />
            <Route path="/productDetails/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
            <Route path="/customize" element={<ProtectedRoute><Customize /></ProtectedRoute>} />
            <Route path="/my-designs" element={<ProtectedRoute><MyDesigns /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
            <Route path="/track-orders/:id" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />
            {/* ================= ADMIN ROUTES (IMPORTANT FIX) ================= */}

            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="payments" element={<AdminPayments/>}/>
            </Route>

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
        </>
      )}
    </>
  );
};

export default App;