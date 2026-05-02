import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const limit = 6;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/admin/orders/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:5000/api/admin/orders/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((o) => (o._id === id ? res.data : o))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const filteredOrders = orders
    .filter((o) => {
      if (filter === "All") return true;
      return o.status === filter;
    })
    .filter((o) => {
      const key = search.toLowerCase();
      return (
        o.userId?.name?.toLowerCase().includes(key) ||
        o.userId?.email?.toLowerCase().includes(key) ||
        o._id.toLowerCase().includes(key)
      );
    });

  const start = (page - 1) * limit;
  const paginatedOrders = filteredOrders.slice(start, start + limit);

  const statusStyle = {
    Pending: "bg-yellow-100 text-yellow-700",
    Processing: "bg-blue-100 text-blue-700",
    Shipped: "bg-purple-100 text-purple-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          🧾 Orders Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Manage all customer orders
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">

        <input
          className="w-full md:w-1/2 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search orders (name, email, id)"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="px-4 py-2 rounded-lg border"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {paginatedOrders.length === 0 ? (
          <div className="text-gray-500">No orders found</div>
        ) : (
          paginatedOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5"
            >

              {/* TOP */}
              <div className="flex justify-between items-start mb-3">

                <div>
                  <h2 className="font-semibold text-gray-700">
                    Order #{order._id.slice(-6)}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {order.userId?.email}
                  </p>
                </div>

                {/* STATUS BADGE */}
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className={`text-xs px-2 py-1 rounded-full border ${
                    statusStyle[order.status]
                  }`}
                >
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>

              </div>

              {/* USER */}
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">User:</span> {order.userId?.name}</p>
                <p><span className="font-medium">Total:</span> ₹{order.totalAmount}</p>
              </div>

              {/* ITEMS */}
              <div className="mt-3 bg-gray-50 rounded-lg p-3 text-sm">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.productId?.name}</span>
                    <span className="text-gray-500">x{item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* CUSTOMER */}
              <div className="mt-3 text-xs text-gray-500 border-t pt-2 space-y-1">
                <p>{order.customer?.name}</p>
                <p>{order.customer?.phone}</p>
                <p>{order.customer?.city}</p>
              </div>

              {/* ACTION */}
              <button
                onClick={() => handleDelete(order._id)}
                className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
              >
                Delete Order
              </button>

            </div>
          ))
        )}

      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-3 mt-8">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-gray-600">
          Page {page}
        </span>

        <button
          disabled={start + limit >= filteredOrders.length}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default AdminOrders;