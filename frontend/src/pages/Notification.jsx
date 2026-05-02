import { useEffect, useState } from "react";
import axios from "axios";
import { FaBell, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}`);
    } catch (err) {
      console.log(err);
    }
  };

  const clearAll = async () => {
  if (!window.confirm("Clear all notifications?")) return;

  try {
    await axios.delete("http://localhost:5000/api/notifications"); // ✅ backend call
    setNotifications([]); // clear UI
  } catch (err) {
    console.log(err);
  }
};
  const handleClick = (n) => {
    markAsRead(n._id);

    setNotifications((prev) =>
      prev.map((item) =>
        item._id === n._id ? { ...item, isRead: true } : item
      )
    );

    if (n.productId) {
      navigate(`/productDetails/${n.productId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-6">

      {/* HEADER */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-8 text-white">
        <div className="flex items-center gap-3">
          <FaBell className="text-3xl" />
          <h1 className="text-3xl font-bold tracking-wide">Notifications</h1>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-2 bg-white text-red-500 px-4 py-2 rounded-full shadow hover:scale-105 transition"
          >
            <FaTrash /> Clear All
          </button>
        )}
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto">

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-white">
            <FaBell className="text-6xl mb-4 opacity-60" />
            <p className="text-lg">No notifications yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">

            {notifications.map((n, index) => (
              <motion.div
                key={n._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleClick(n)}
                className={`cursor-pointer rounded-2xl p-5 backdrop-blur-lg border transition
                  ${n.isRead
                    ? "bg-white/90 border-gray-200"
                    : "bg-white/70 border-blue-400 shadow-lg"}
                `}
              >
                <div className="flex justify-between items-start gap-4">

                  {/* LEFT */}
                  <div className="flex gap-4">

                    {/* ICON */}
                    <div className={`p-3 rounded-full text-white
                      ${n.isRead ? "bg-gray-400" : "bg-blue-500 animate-pulse"}`}>
                      <FaBell />
                    </div>

                    {/* TEXT */}
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {n.title || "New Notification"}
                      </h3>

                      <p className="text-gray-600 text-sm mt-1">
                        {n.message}
                      </p>

                      {!n.isRead && (
                        <span className="inline-block mt-2 text-xs font-semibold text-white bg-red-500 px-2 py-1 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="text-right text-xs text-gray-500 whitespace-nowrap">
                    {new Date(n.createdAt).toLocaleDateString()}
                    <br />
                    {new Date(n.createdAt).toLocaleTimeString()}
                  </div>

                </div>
              </motion.div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}