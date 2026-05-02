import { useEffect, useState } from "react";
import axios from "axios";

const Admin = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.role !== "admin") {
    return (
      <div style={styles.center}>
        <h2>Access Denied ❌</h2>
      </div>
    );
  }

  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("products");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/products");
    setProducts(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    if (image) formData.append("image", image);

    if (editingId) {
      await axios.put(`http://localhost:5000/product/${editingId}`, formData);
      alert("Updated ✅");
    } else {
      await axios.post("http://localhost:5000/add-product", formData);
      alert("Added ✅");
    }

    setName("");
    setPrice("");
    setCategory("");
    setImage(null);
    setEditingId(null);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/product/${id}`);
    fetchProducts();
  };

  const editProduct = (item) => {
    setEditingId(item._id);
    setName(item.name);
    setPrice(item.price);
    setCategory(item.category);
  };

  return (
  <div style={styles.wrapper}>

    {/* ===== SIDEBAR ===== */}
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>🛒 Admin</h2>

      <p
        onClick={() => setActiveTab("dashboard")}
        style={{
          ...styles.menu,
          background: activeTab === "dashboard" ? "#2563eb" : "transparent"
        }}
      >
        📊 Dashboard
      </p>

      <p
        onClick={() => setActiveTab("products")}
        style={{
          ...styles.menu,
          background: activeTab === "products" ? "#2563eb" : "transparent"
        }}
      >
        📦 Products
      </p>

      <p
        onClick={() => setActiveTab("orders")}
        style={{
          ...styles.menu,
          background: activeTab === "orders" ? "#2563eb" : "transparent"
        }}
      >
        🧾 Orders
      </p>

      <p
        onClick={() => setActiveTab("users")}
        style={{
          ...styles.menu,
          background: activeTab === "users" ? "#2563eb" : "transparent"
        }}
      >
        👤 Users
      </p>
    </div>

    {/* ===== MAIN ===== */}
    <div style={styles.main}>
      
      {/* TOPBAR */}
      <div style={styles.topbar}>
        <h2>{activeTab.toUpperCase()}</h2>
      </div>

      {/* ===== CONTENT ===== */}
      {activeTab === "dashboard" && (
        <div style={styles.dashboard}>
          <div style={styles.card}>Total Products: {products.length}</div>
          <div style={styles.card}>Orders: Coming Soon</div>
          <div style={styles.card}>Users: Coming Soon</div>
        </div>
      )}

      {activeTab === "products" && (
        <>
          <form onSubmit={handleSubmit} style={styles.formBar}>
  
  <div style={styles.inputGroup}>
    <span style={styles.icon}>📦</span>
    <input
      placeholder="Product Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      style={styles.input}
    />
  </div>

  <div style={styles.inputGroup}>
    <span style={styles.icon}>💰</span>
    <input
      type="number"
      placeholder="Price"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      style={styles.input}
    />
  </div>

  <div style={styles.inputGroup}>
    <span style={styles.icon}>🏷️</span>
    <input
      placeholder="Category"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      style={styles.input}
    />
  </div>

  <label style={styles.fileBox}>
    📁 Upload Image
    <input
      type="file"
      onChange={(e) => setImage(e.target.files[0])}
      style={{ display: "none" }}
    />
  </label>

  <button
  style={styles.addBtn}
  onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
  onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
>
  {editingId ? "Update" : "Add"}
</button>

</form>
          <div style={styles.grid}>
            {products.map((item) => (
              <div key={item._id} style={styles.productCard}>
                <img
                  src={`http://localhost:5000${item.image}`}
                  style={styles.img}
                  alt=""
                />
                <h4>{item.name}</h4>
                <p>₹{item.price}</p>

                
<div style={styles.actions}>
  <button
    onClick={() => editProduct(item)}
    style={styles.editBtn}
  >
    Edit
  </button>

  <button
    onClick={() => handleDelete(item._id)}
    style={styles.deleteBtn}
  >
    Delete
  </button>
</div>
               
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "orders" && <h3>Orders coming soon 🚀</h3>}
      {activeTab === "users" && <h3>Users coming soon 🚀</h3>}

    </div>
  </div>
);
}
const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    fontFamily: "Segoe UI, sans-serif",
  },

  // ===== SIDEBAR =====
  sidebar: {
    width: "240px",
    background: "linear-gradient(180deg, #0f172a, #1e293b)",
    color: "#fff",
    padding: "25px 15px",
    boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
  },

  logo: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "30px",
    textAlign: "center",
  },

  menu: {
    padding: "12px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "10px",
    transition: "0.3s",
  },

  // ===== MAIN =====
  main: {
    flex: 1,
    background: "#f8fafc",
    overflowY: "auto",
  },

  topbar: {
    background: "#fff",
    padding: "15px 25px",
    borderBottom: "1px solid #eee",
    fontWeight: "bold",
    fontSize: "18px",
  },

  // ===== DASHBOARD CARDS =====
  dashboard: {
    display: "flex",
    gap: "20px",
    padding: "20px",
  },

  card: {
    flex: 1,
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "16px",
  },

  // ===== FORM =====
  formBar: {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1.5fr 1.5fr auto",
  gap: "15px",
  alignItems: "center",
  padding: "20px",
  background: "#ffffff",
  borderRadius: "16px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  margin: "20px",
},

inputGroup: {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  padding: "0 10px",
  background: "#f8fafc",
  transition: "0.3s",
},

icon: {
  fontSize: "16px",
},

input: {
  border: "none",
  outline: "none",
  padding: "12px",
  background: "transparent",
  width: "100%",
  fontSize: "14px",
},

fileBox: {
  padding: "12px",
  borderRadius: "10px",
  border: "2px dashed #cbd5e1",
  textAlign: "center",
  cursor: "pointer",
  background: "#f8fafc",
  fontSize: "14px",
  transition: "0.3s",
  boxShadow: "0 4px 15px rgba(37,99,235,0.4)",
},

addBtn: {
  padding: "12px 20px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.3s",   // 🔥 this enables smooth hover
},
  // ===== GRID =====
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))",
    gap: "20px",
    padding: "20px",
  },

  productCard: {
    background: "#fff",
    padding: "12px",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
    textAlign: "center",
    transition: "0.3s",
  },

  img: {
    width: "100%",
    height: "140px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "10px",
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },

  editBtn: {
  border: "1px solid #f59e0b",
  background: "transparent",
  color: "#f59e0b",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer",
},

deleteBtn: {
  border: "1px solid rgba(239, 68, 68, 0.26)",
  background: "red",
  color: "black",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer",

},

  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
};
export default Admin;