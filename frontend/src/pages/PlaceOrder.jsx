import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function PlaceOrder() {
  const { cart, fetchCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    payment: "COD",
  });

  // ✅ FIX: handleChange
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const totalAmount = cart.reduce((t, i) => {
  const price = i.isCustom ? i.price : i.productId?.price || 0;
  return t + price * i.quantity;
}, 0);
  const finalTotal = totalAmount - discount;

  // 🎯 APPLY COUPON
  const applyCoupon = () => {
    if (coupon === "SAVE10") {
      setDiscount(totalAmount * 0.1);
    } else {
      alert("Invalid coupon");
    }
  };

  // 🚀 PLACE ORDER
  const handleOrder = async () => {
  try {
    const customDesign = JSON.parse(localStorage.getItem("customDesign"));

    const payload = {
      customer: formData,
      items: cart.map((i) => ({
  productId: i.isCustom ? null : i.productId?._id,
  name: i.isCustom ? i.name : i.productId?.name,
  image: i.isCustom ? i.image : i.productId?.image,
  price: i.isCustom ? i.price : i.productId?.price,
  quantity: i.quantity,
  isCustom: i.isCustom || false,
})),
      // 🔥 ADD THIS
      customDesign: customDesign || null,

      totalAmount: finalTotal,
    };

    console.log("ORDER PAYLOAD:", payload);

    await api.post("/api/orders", payload);

    await fetchCart();

    // 🧹 clear design after order
    localStorage.removeItem("customDesign");

    navigate("/orders");
  } catch (err) {
    console.log(err);
    alert("Order failed");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-4">

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-center mb-8">
        Secure Checkout
      </h1>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* STEP INDICATOR */}
          <div className="flex justify-between text-sm font-semibold">
            <span className={step >= 1 ? "text-blue-600" : ""}>Address</span>
            <span className={step >= 2 ? "text-blue-600" : ""}>Payment</span>
            <span className={step >= 3 ? "text-blue-600" : ""}>Review</span>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-6 rounded-2xl shadow space-y-4"
            >
              <h2 className="font-semibold text-lg">Delivery Address</h2>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full border px-4 py-3 rounded-xl"
              />

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full border px-4 py-3 rounded-xl"
              />

              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full border px-4 py-3 rounded-xl"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full border px-4 py-3 rounded-xl"
                />

                <input
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  className="w-full border px-4 py-3 rounded-xl"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white py-2 rounded-xl"
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div className="bg-white p-6 rounded-2xl shadow space-y-4">
              <h2 className="font-semibold text-lg">Payment Method</h2>

              <label className="block">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={formData.payment === "COD"}
                  onChange={handleChange}
                /> Cash on Delivery
              </label>

              <label className="block">
                <input
                  type="radio"
                  name="payment"
                  value="ONLINE"
                  checked={formData.payment === "ONLINE"}
                  onChange={handleChange}
                /> Online Payment
              </label>

              <button
                onClick={() => setStep(3)}
                className="w-full bg-blue-600 text-white py-2 rounded-xl"
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div className="bg-white p-6 rounded-2xl shadow space-y-4">

              <h2 className="font-semibold text-lg">Review Order</h2>

              {/* COUPON */}
              <div className="flex gap-2">
                <input
                  placeholder="Coupon Code (SAVE10)"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="border px-3 py-2 rounded w-full"
                />
                <button
                  onClick={applyCoupon}
                  className="bg-gray-800 text-white px-4 rounded"
                >
                  Apply
                </button>
              </div>

              {/* TOTAL */}
              <div className="border-t pt-3">
                <p>Total: ₹{totalAmount}</p>
                <p className="text-green-600">Discount: -₹{discount}</p>
                <p className="font-bold text-lg">
                  Final: ₹{finalTotal}
                </p>
              </div>

              <button
                onClick={handleOrder}
                className="w-full bg-green-600 text-white py-3 rounded-xl text-lg"
              >
                Place Order 🚀
              </button>

            </motion.div>
          )}

        </div>

        {/* RIGHT SUMMARY */}
        <div className="bg-white p-6 rounded-2xl shadow h-fit sticky top-5">

          <h2 className="font-semibold mb-3">Cart Summary</h2>

          {cart.map((i, idx) => (
  <div key={idx} className="flex justify-between text-sm border-b py-2">
    
    <span>
      {i.isCustom ? i.name : i.productId?.name} × {i.quantity}
    </span>

    <span>
      ₹{(i.isCustom ? i.price : i.productId?.price || 0) * i.quantity}
    </span>

  </div>
))}
          <p className="mt-4 font-bold text-blue-600">
            Total: ₹{finalTotal}
          </p>

        </div>

      </div>
    </div>
  );
}