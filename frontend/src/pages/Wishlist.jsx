import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  const navigate = useNavigate();

  // ✅ USE CONTEXT (IMPORTANT FIX)
  const { addToCart } = useContext(CartContext);

  // ================= LOAD WISHLIST =================
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(data);
  }, []);

  // ================= SYNC =================
  useEffect(() => {
    const handleChange = () => {
      const data = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlist(data);
    };

    window.addEventListener("wishlistChange", handleChange);
    return () =>
      window.removeEventListener("wishlistChange", handleChange);
  }, []);

  // ================= REMOVE =================
  const removeItem = (id) => {
    const updated = wishlist.filter((item) => item._id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));

    window.dispatchEvent(new Event("wishlistChange"));
  };

  // ================= ADD TO CART (FIXED) =================
  const handleAddToCart = async (item) => {
    try {
      await addToCart(item);   // ✅ IMPORTANT (not api.post)

      alert("Added to cart 🛒");

      navigate("/cart");       // ✅ redirect AFTER state update
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-100 min-h-screen p-6">

      <h2 className="text-3xl font-bold text-center mb-6 text-white">
        My Wishlist ❤️
      </h2>

      {wishlist.length === 0 ? (
        <p className="text-center text-white">
          Your wishlist is empty 😢
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

          {wishlist.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow hover:shadow-md transition flex flex-col"
            >

              {/* IMAGE */}
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={
                    item.image?.startsWith("http")
                      ? item.image
                      : `http://localhost:5000${item.image}`
                  }
                  alt={item.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
              </div>

              {/* CONTENT */}
              <div className="p-3 flex flex-col flex-1">

                <h3 className="text-sm font-semibold truncate">
                  {item.name}
                </h3>

                <p className="text-gray-500 text-sm mb-2">
                  ₹{item.price}
                </p>

                {/* BUTTONS */}
                <div className="mt-auto flex gap-2">

                  {/* ADD TO CART */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-md text-xs"
                  >
                    Add to Cart
                  </button>

                  {/* REMOVE */}
                  <button
                    onClick={() => removeItem(item._id)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 rounded-md text-xs"
                  >
                    Remove
                  </button>

                </div>
              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default Wishlist;