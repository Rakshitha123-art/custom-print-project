import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/payments");
      console.log("PAYMENTS:", res.data);

      // ✅ Ensure array
      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      setError("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SAFE DATA
  const safePayments = Array.isArray(payments) ? payments : [];

  // 🔍 Filter + Search
  const filtered = safePayments.filter((p) => {
    const matchSearch =
      p.paymentId?.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "all" ? true : p.status === filter;

    return matchSearch && matchFilter;
  });

  // 💰 Total Revenue
  const totalRevenue = safePayments
    .filter((p) => p.status === "success")
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  // 📊 Chart Data
  const chartData = Object.values(
    safePayments.reduce((acc, p) => {
      const month = p.createdAt
        ? new Date(p.createdAt).toLocaleString("default", {
            month: "short",
          })
        : "N/A";

      if (!acc[month]) {
        acc[month] = { name: month, revenue: 0 };
      }

      if (p.status === "success") {
        acc[month].revenue += Number(p.amount || 0);
      }

      return acc;
    }, {})
  );

  // 🔄 LOADING UI
  if (loading) {
    return <div className="p-6 text-lg">Loading payments...</div>;
  }

  // ❌ ERROR UI
  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  // 📭 EMPTY UI
  if (safePayments.length === 0) {
    return <div className="p-6 text-gray-500">No payments found</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <h2 className="text-2xl font-bold mb-6">💳 Payments Dashboard</h2>

      {/* 💰 Revenue Card */}
      <div className="bg-green-500 text-white p-6 rounded-2xl shadow mb-6">
        <p className="text-sm">Total Revenue</p>
        <h2 className="text-3xl font-bold">₹{totalRevenue}</h2>
      </div>

      {/* 📊 Chart */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h3 className="mb-4 font-semibold">Monthly Revenue</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line dataKey="revenue" stroke="#22c55e" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🔍 Search + Filter */}
      <div className="flex flex-wrap gap-4 mb-4">

        <div className="flex items-center bg-white px-3 py-2 rounded shadow">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            placeholder="Search Payment ID"
            className="outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="bg-white px-3 py-2 rounded shadow text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* 📄 Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <div className="grid grid-cols-4 bg-gray-50 px-6 py-3 text-xs font-semibold text-gray-600">
          <span>ID</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Date</span>
        </div>

        {filtered.map((p) => (
          <div
            key={p._id}
            className="grid grid-cols-4 px-6 py-3 border-b text-sm hover:bg-gray-50"
          >
            <span>{p.paymentId || "N/A"}</span>
            <span>₹{p.amount || 0}</span>

            <span>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  p.status === "success"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {p.status}
              </span>
            </span>

            <span>
              {p.createdAt
                ? new Date(p.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPayments;