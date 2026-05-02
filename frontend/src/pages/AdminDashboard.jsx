import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStats(res.data);
    };

    // fake chart data (replace with real API later)
    setChartData([
      { name: "Jan", orders: 30 },
      { name: "Feb", orders: 45 },
      { name: "Mar", orders: 60 },
      { name: "Apr", orders: 40 },
    ]);

    fetchStats();
  }, []);

  return (
    <div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

        <Card title="Users" value={stats.users} icon={<FaUsers />} color="blue" />
        <Card title="Products" value={stats.products} icon={<FaBoxOpen />} color="green" />
        <Card title="Orders" value={stats.orders} icon={<FaShoppingCart />} color="purple" />

      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="font-semibold mb-4">Orders Overview</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="orders" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

function Card({ title, value, icon, color }) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div className={`bg-gradient-to-r ${colors[color]} text-white p-6 rounded-2xl shadow-lg flex justify-between items-center hover:scale-105 transition`}>
      <div>
        <p className="text-sm opacity-80">{title}</p>
        <h2 className="text-3xl font-bold">{value}</h2>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  );
}

export default AdminDashboard;