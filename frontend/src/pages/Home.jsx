import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import image from "../assets/home-bg.png";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // fetch featured products
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data.slice(0, 6))) // only 6 products
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="home-wrapper" style={{ backgroundImage: `url(${image})` }}>

      {/* HERO */}
      <div className="hero-overlay">
        <div className="hero-content">

          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Welcome to <span>PrintifyHub</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            Creative designing & printing solutions made simple & modern
          </motion.p>

          <div className="hero-buttons">
            <button className="btn primary" onClick={() => navigate("/customize")}>
              Customize
            </button>

            <button className="btn secondary" onClick={() => navigate("/collection")}>
              Shop Now
            </button>
          </div>

        </div>
      </div>

      {/* FEATURE SECTION */}
      <div className="feature-section">
        <h2>Why Choose Us</h2>

        <div className="feature-grid">
          <div className="feature-card">🎨 Custom Designs</div>
          <div className="feature-card">🚀 Fast Delivery</div>
          <div className="feature-card">💎 Premium Quality</div>
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <div className="product-section">
        <h2>🔥 Featured Products</h2>

        <div className="product-grid">
          {products.map((item) => (
            <div key={item._id} className="product-card">

              <img
                src={`http://localhost:5000${item.image}`}
                alt={item.name}
              />

              <h3>{item.name}</h3>
              <p>₹ {item.price}</p>

              <button onClick={() => navigate(`/productDetails/${item._id}`)}>
                View
              </button>

            </div>
          ))}
        </div>

        <button className="view-all" onClick={() => navigate("/collection")}>
          View All Products
        </button>
      </div>

    </div>
  );
};

export default Home;