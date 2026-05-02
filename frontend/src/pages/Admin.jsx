import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();

  const styles = {
    container: {
      display: "flex",
      height: "100vh",
    },
    sidebar: {
      width: "220px",
      background: "#111",
      color: "#fff",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    main: {
      flex: 1,
      padding: "20px",
      background: "#f5f5f5",
    },
    link: {
      color: "#fff",
      textDecoration: "none",
      padding: "10px",
      borderRadius: "5px",
    },
    active: {
      background: "#333",
    },
    logout: {
      marginTop: "auto",
      cursor: "pointer",
      color: "red",
    },
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={styles.container}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2>🛒 Admin Panel</h2>

        <NavLink
          to=""
          end
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="products"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
        >
          📦 Products
        </NavLink>

        <NavLink
          to="orders"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
        >
          🧾 Orders
        </NavLink>

        <NavLink
          to="users"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
        >
          👤 Users
        </NavLink>
        <NavLink
  to="payments"
  style={({ isActive }) =>
    isActive ? { ...styles.link, ...styles.active } : styles.link
  }
>
  💳 Payments
</NavLink>

        <div style={styles.logout} onClick={handleLogout}>
          🚪 Logout
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.main}>
        <Outlet />
      </div>

    </div>
  );
}

export default Admin;