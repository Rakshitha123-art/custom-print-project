import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fileRef = useRef();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch {
      toast.error("Failed to load products");
    }
  };

  // ================= SUBMIT (ADD / UPDATE) =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      if (image) formData.append("image", image);

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/products/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Product updated");
      } else {
        await axios.post(
          "http://localhost:5000/api/products",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Product added");
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      console.log(err);
      toast.error("Operation failed");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/products/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Deleted successfully");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ================= EDIT =================
  const editProduct = (item) => {
    setEditingId(item._id);
    setName(item.name);
    setPrice(item.price);
    setCategory(item.category);
  };

  // ================= RESET FORM =================
  const resetForm = () => {
    setName("");
    setPrice("");
    setCategory("");
    setImage(null);
    setEditingId(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h2 className="text-2xl font-bold mb-6">
        📦 Product Management
      </h2>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="font-semibold mb-4">
            {editingId ? "Edit Product" : "Add Product"}
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            <input
              className="border p-3 rounded-lg"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="number"
              className="border p-3 rounded-lg"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <input
              className="border p-3 rounded-lg"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />

            <input
              ref={fileRef}
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />

            <button className="bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2">
              <FaPlus />
              {editingId ? "Update" : "Add Product"}
            </button>

          </form>
        </div>

        {/* PRODUCTS */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 md:grid-cols-3 gap-6">

          {products.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow overflow-hidden"
            >

              <img
                src={`http://localhost:5000${item.image}`}
                alt={item.name}
                className="w-full h-40 object-cover"
                onError={(e) =>
                  (e.target.src = "/fallback.jpg")
                }
              />

              <div className="p-4 text-center">
                <h4 className="font-semibold">
                  {item.name}
                </h4>

                <p className="text-blue-600 font-bold">
                  ₹{item.price}
                </p>

                <p className="text-xs text-gray-500">
                  {item.category}
                </p>

                <div className="flex justify-center gap-3 mt-3">

                  <button
                    onClick={() => editProduct(item)}
                    className="text-blue-600"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600"
                  >
                    <FaTrash />
                  </button>

                </div>
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}