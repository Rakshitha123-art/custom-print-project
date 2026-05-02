import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

function Settings() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "123456"
  });

  const [darkMode, setDarkMode] = useState(false);

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    offers: true,
    newsletter: false,
    smsAlerts: false
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    newPass: "",
    confirm: ""
  });

  // LOAD DATA
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    const notify = JSON.parse(localStorage.getItem("notifications"));
    const theme = localStorage.getItem("darkMode");

    if (data) setUser(data);
    if (notify) setNotifications(notify);
    if (theme === "true") setDarkMode(true);
  }, []);

  // DARK MODE APPLY
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-gray-900");
    } else {
      document.body.classList.remove("bg-gray-900");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // PROFILE SAVE
  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(user));
    toast.success("Profile updated ✅");
  };

  // PASSWORD
  const handlePasswordSave = () => {
    if (passwordData.current !== user.password) {
      return toast.error("Wrong current password ❌");
    }

    if (passwordData.newPass !== passwordData.confirm) {
      return toast.error("Passwords do not match ❌");
    }

    const updated = { ...user, password: passwordData.newPass };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));

    toast.success("Password changed 🔐");

    setPasswordData({ current: "", newPass: "", confirm: "" });
  };

  // TOGGLE NOTIFICATION
  const toggleNotification = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));

    toast("Settings updated 🔔");
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-200"}`}>

      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6">

        {/* PROFILE */}
        <div>
          <h2 className="text-xl font-bold mb-3">Account Settings</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              value={user.name}
              onChange={(e) => setUser({...user, name: e.target.value})}
              className="border p-2 rounded text-black"
              placeholder="Name"
            />

            <input
              value={user.email}
              onChange={(e) => setUser({...user, email: e.target.value})}
              className="border p-2 rounded text-black"
              placeholder="Email"
            />

            <input
              value={user.phone}
              onChange={(e) => setUser({...user, phone: e.target.value})}
              className="border p-2 rounded text-black"
              placeholder="Phone"
            />
          </div>

          <button
            onClick={handleSave}
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Profile
          </button>
        </div>

        {/* PASSWORD */}
        <div>
          <h3 className="font-semibold mb-2">Change Password</h3>

          <div className="grid gap-3">
            <input
              type="password"
              placeholder="Current Password"
              value={passwordData.current}
              onChange={(e) =>
                setPasswordData({ ...passwordData, current: e.target.value })
              }
              className="border p-2 rounded text-black"
            />

            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPass}
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPass: e.target.value })
              }
              className="border p-2 rounded text-black"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={passwordData.confirm}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirm: e.target.value })
              }
              className="border p-2 rounded text-black"
            />

            <button
              onClick={handlePasswordSave}
              className="bg-blue-600 text-white py-2 rounded"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* 🔔 NOTIFICATIONS */}
        <div>
          <h3 className="font-semibold mb-3">Notifications</h3>

          {Object.keys(notifications).map((key) => (
            <div key={key} className="flex justify-between items-center mb-3">
              <span className="capitalize">{key}</span>

              <button
                onClick={() => toggleNotification(key)}
                className={`w-12 h-6 flex items-center rounded-full p-1 ${
                  notifications[key] ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full transform ${
                    notifications[key] ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* 🌙 DARK MODE */}
        <div className="flex justify-between items-center">
          <span>Dark Mode</span>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 flex items-center rounded-full p-1 ${
              darkMode ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full transform ${
                darkMode ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

      </div>
    </div>
  );
}

export default Settings;