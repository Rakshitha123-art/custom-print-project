import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function Collection() {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const location = useLocation();

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  // ✅ wishlist state (FIXED)
  const [wishlist, setWishlist] = useState([]);

  const [showBuy, setShowBuy] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // ===============================
  // LOAD WISHLIST
  // ===============================
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(data);
  }, []);

  // ===============================
  // SYNC WISHLIST
  // ===============================
  useEffect(() => {
    const handleWishlistChange = () => {
      const data = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlist(data);
    };

    window.addEventListener("wishlistChange", handleWishlistChange);

    return () =>
      window.removeEventListener("wishlistChange", handleWishlistChange);
  }, []);

  // ===============================
  // TOGGLE WISHLIST (FIXED)
  // ===============================
  const addToWishlist = (item) => {
    let updated;

    const exists = wishlist.find((p) => p._id === item._id);

    if (exists) {
      updated = wishlist.filter((p) => p._id !== item._id);
    } else {
      updated = [...wishlist, item];
    }

    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));

    window.dispatchEvent(new Event("wishlistChange"));
  };

  // ===============================
  // GET SEARCH FROM URL
  // ===============================
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search") || "";
    setSearch(searchQuery);
  }, [location.search]);

  // ===============================
  // FETCH PRODUCTS
  // ===============================
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        setAllProducts(res.data);

        const uniqueCategories = [
          "all",
          ...new Set(res.data.map((item) => item.category)),
        ];

        setCategories(uniqueCategories);
      })
      .catch((err) => console.log("FETCH ERROR:", err));
  }, []);

  // ===============================
  // FILTER PRODUCTS
  // ===============================
  useEffect(() => {
    let filtered = [...allProducts];

    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (item) => item.category === activeCategory
      );
    }

    if (search.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // remove duplicates
    const map = new Map();
    filtered.forEach((item) => {
      if (!map.has(item._id)) {
        map.set(item._id, item);
      }
    });

    setFilteredProducts(Array.from(map.values()));
  }, [search, activeCategory, allProducts]);

  // ===============================
  // SCROLL BUTTON
  // ===============================
  useEffect(() => {
    const handleScroll = () => {
      if (!selectedItem) return;
      setShowBuy(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedItem]);

  // ===============================
  // UI
  // ===============================
  return (
    <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-100 min-h-screen p-6">

      <h1 className="text-3xl font-bold text-center mb-6">
        New Arrivals
      </h1>

      {/* SEARCH */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-lg px-5 py-3 border rounded-full shadow-sm"
        />
      </div>

      {/* CATEGORY */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full ${
              activeCategory === cat
                ? "bg-black text-white"
                : "bg-white"
            }`}
          >
            {(cat || "").replaceAll("-", " ")}
          </button>
        ))}
      </div>

      {/* PRODUCTS */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No products found 😢
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

          {filteredProducts.map((item) => {
            const isLiked = wishlist.some((p) => p._id === item._id);

            return (
              <div
                key={item._id}
                onClick={() => setSelectedItem(item)}
                className="bg-white rounded-xl shadow hover:shadow-lg flex flex-col"
              >
                {/* IMAGE */}
                <div className="relative h-64">

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToWishlist(item);
                    }}
                    className="absolute top-2 right-2 bg-white p-2 rounded-full"
                  >
                    {isLiked ? "❤️" : "🤍"}
                  </button>

                  <img
                    src={`http://localhost:5000${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-3 flex flex-col flex-1">

                  <h3 className="text-sm font-semibold">
                    {item.name}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    ₹{item.price}
                  </p>

                  <div className="mt-auto flex gap-2">

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/productDetails/${item._id}`);
                      }}
                      className="flex-1 bg-blue-500 text-white py-2 rounded"
                    >
                      View
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item); // ✅ FIXED
                        navigate("/cart");
                      }}
                      className="flex-1 bg-purple-600 text-white py-2 rounded"
                    >
                      Add
                    </button>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FLOAT BUTTON */}
      {showBuy && selectedItem && (
        <div className="fixed bottom-6 right-6 flex gap-2">

          <button
            onClick={() => addToCart(selectedItem)} // ✅ FIXED
            className="bg-blue-600 text-white px-5 py-3 rounded-full"
          >
            Add to Cart
          </button>

          <button
            onClick={() =>
              navigate(`/productDetails/${selectedItem._id}`) // ✅ FIXED
            }
            className="bg-green-600 text-white px-5 py-3 rounded-full"
          >
            Buy ₹{selectedItem.price}
          </button>

        </div>
      )}
    </div>
  );
}