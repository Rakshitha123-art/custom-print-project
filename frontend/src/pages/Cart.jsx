import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, updateQty } = useContext(CartContext);
  const navigate = useNavigate();

  // ✅ TOTAL CALCULATION
  const total = cart.reduce((sum, item) => {
    const price = item.isCustom
      ? item.price
      : item.productId?.price || item.price || 0;

    return sum + price * (item.quantity || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <h1 className="text-3xl text-white mb-6 text-center">
        Your Cart
      </h1>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xl">

        {/* EMPTY CART */}
        {cart.length === 0 ? (
          <p className="text-center text-gray-600">
            Cart is empty 😢
          </p>
        ) : (
          cart.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center border-b py-4"
            >

              {/* LEFT: IMAGE + DETAILS */}
              <div className="flex items-center gap-4">

                <img
                  src={
                    item.isCustom
                      ? item.image
                      : item.productId?.image
                        ? `http://localhost:5000${item.productId.image}`
                        : item.image
                          ? `http://localhost:5000${item.image}`
                          : "/placeholder.png"
                  }
                  onError={(e) => (e.target.src = "/placeholder.png")}
                  alt="product"
                  className="w-16 h-16 object-cover rounded"
                />

                <div>
                  <h2 className="font-semibold">
                    {item.isCustom
                      ? item.name
                      : item.productId?.name || item.name}
                  </h2>

                  <p className="text-gray-600">
                    ₹
                    {item.isCustom
                      ? item.price
                      : item.productId?.price || item.price || 0}
                  </p>
                </div>
              </div>

              {/* QTY CONTROLS */}
              <div className="flex items-center gap-2">

                <button
                  onClick={() => {
                    if (item.quantity > 1) {
                      updateQty(item._id, item.quantity - 1);
                    }
                  }}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  -
                </button>

                <span className="font-semibold">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    updateQty(item._id, item.quantity + 1)
                  }
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>

              {/* REMOVE */}
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          ))
        )}

        {/* TOTAL */}
        <div className="mt-4 text-right font-bold text-lg">
          Total: ₹{total}
        </div>

        {/* CHECKOUT */}
        <button
          onClick={() => navigate("/placeorder")}
          className="w-full mt-4 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-500 text-white py-3 rounded-lg hover:opacity-90"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}