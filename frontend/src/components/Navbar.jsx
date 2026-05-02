import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  FaSearch,
  FaShoppingCart,
  FaBars,
  FaHome,
  FaUser,
  FaUserCircle,
  FaHeart,
  FaBell
} from "react-icons/fa";
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import "./Navbar.css";
import logo from '../assets/logo.jpg';
import { CartContext } from "../context/CartContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showBadge, setShowBadge] = useState(false);
  const [wishlistUpdate, setWishlistUpdate] = useState(0);
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  const wishlistCount = wishlist.length;
  const [hasNewProduct, setHasNewProduct] = useState(false);
const lastSeenProductId = useRef(null);
useEffect(() => {
  const checkNewProduct = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products/latest");
      const data = await res.json();

      if (!data?._id) return;

      // first time
      if (!lastSeenProductId.current) {
        lastSeenProductId.current = data._id;
        return;
      }

      // if new product added
      if (data._id !== lastSeenProductId.current) {
        setHasNewProduct(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  checkNewProduct();
  const interval = setInterval(checkNewProduct, 5000); // every 5 sec

  return () => clearInterval(interval);
}, []);

  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef();

  const { cart } = useContext(CartContext);
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/users/get/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setProfileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const handleHome = () => {
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const syncWishlist = () => {
      setShowBadge(true);
      setTimeout(() => setShowBadge(false), 2000);
    };

    window.addEventListener("wishlistChange", syncWishlist);
    return () => window.removeEventListener("wishlistChange", syncWishlist);
  }, []);

  const profileImg = user && user.image
    ? `http://localhost:5000/uploads/${user.image}`
    : null;

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/home">
          <img
            src={logo}
            alt="Logo"
            onClick={handleHome}
            className="h-10 w-auto object-contain cursor-pointer hover:scale-110 transition duration-300"
          />
        </Link>
      </div>

      {/* MENU */}
      <ul className={menuOpen ? "menu active" : "menu"}>
        <li>
          <button className="nav-link" onClick={handleHome}>
            <FaHome style={{ marginRight: "6px" }} />
            {role === "admin" ? "Dashboard" : "Home"}
          </button>
        </li>

        <li>
          <NavLink to="/collection" className="nav-link" onClick={() => setMenuOpen(false)}>
            📦 Collection
          </NavLink>
        </li>

        <li>
          <NavLink to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>
            ℹ️ About
          </NavLink>
        </li>

        <li>
          <NavLink to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>
            📞 Contact
          </NavLink>
        </li>

        <li>
          <NavLink to="/orders" className="nav-link" onClick={() => setMenuOpen(false)}>
            🧾 Orders
          </NavLink>
        </li>

        {role === "admin" && (
          <li>
            <NavLink to="/admin" onClick={() => setMenuOpen(false)}>
              Admin Panel
            </NavLink>
          </li>
        )}
      </ul>

      {/* RIGHT SIDE */}
      <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

        <Link to="/login">
          <button className="btn-primary" style={{
            padding: '8px 20px',
            fontSize: '0.9rem',
            border: '2px solid white',
            borderRadius: '20px'
          }}>
            Login
          </button>
        </Link>

        {/* 🔔 Bell Icon */}
        <div
  style={{ position: "relative", cursor: "pointer" }}
  onClick={() => {
    setHasNewProduct(false); // remove red dot
    navigate("/notifications"); // 🔥 go to notification page
  }}
>
  <FaBell size={20} />

  {hasNewProduct && (
    <span
      style={{
        position: "absolute",
        top: "-4px",
        right: "-4px",
        width: "10px",
        height: "10px",
        background: "red",
        borderRadius: "50%",
        animation: "pulse 1s infinite"
      }}
    />
  )}
</div>

        {/* Cart */}
        <Link to="/cart" className="cart" style={{
          color: "inherit",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          position: "relative"
        }}>
          <FaShoppingCart size={20} />

          {totalItems > 0 && (
            <span className="cart-count" style={{
              position: "absolute",
              top: "-8px",
              right: "-10px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "12px"
            }}>
              {totalItems}
            </span>
          )}
        </Link>

        {/* Wishlist */}
        <Link to="/wishlist" className="wishlist" style={{ position: "relative" }}>
          <FaHeart size={20} color="white" />

          {showBadge && (
            <span style={{
              position: "absolute",
              top: "-4px",
              right: "-6px",
              width: "8px",
              height: "8px",
              background: "red",
              borderRadius: "50%"
            }} />
          )}
        </Link>

        {/* Hamburger */}
        <FaBars className="hamburger" onClick={() => setMenuOpen(prev => !prev)} />

        {/* Profile */}
        <div className="relative ml-4" ref={profileRef}>
          <div
            className="cursor-pointer text-2xl"
            onClick={() => setProfileOpen(prev => !prev)}
          >
            {profileImg ? (
              <img
                src={profileImg}
                alt="profile"
                style={{ width: "32px", height: "32px", borderRadius: "50%" }}
              />
            ) : (
              <FaUserCircle />
            )}
          </div>

          {profileOpen && (
            <div className="profile-dropdown absolute right-0 mt-2 w-44 bg-white text-gray-800 shadow-lg rounded-md z-[9999]">
              <button onClick={() => navigate("/profile")}>Profile</button>
              <button onClick={() => navigate("/setting")}>Settings</button>
              <button onClick={() => navigate("/orders")}>Orders</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;