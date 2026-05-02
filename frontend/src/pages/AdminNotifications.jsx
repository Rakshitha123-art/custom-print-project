import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/notifications"
    );
    setNotifications(res.data);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        🔔 Notifications
      </h2>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n._id}
            className={`p-4 rounded-lg shadow ${
              n.read ? "bg-gray-100" : "bg-white border-l-4 border-blue-500"
            }`}
          >
            <p>{n.message}</p>
            <span className="text-xs text-gray-500">
              {new Date(n.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}