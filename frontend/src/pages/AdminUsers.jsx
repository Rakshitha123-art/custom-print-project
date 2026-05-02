import React, { useEffect, useState } from "react";
import { FaSearch, FaTrash, FaUserEdit } from "react-icons/fa";
import toast from "react-hot-toast";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Error loading users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });

      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  const openEdit = (user) => {
    setEditUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
    });
  };

  const handleUpdate = async () => {
    try {
      await fetch(`http://localhost:5000/api/users/${editUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      toast.success("User updated");
      setEditUser(null);
      fetchUsers();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          👤 Users Management
        </h2>
        <p className="text-gray-500 text-sm">
          Manage all registered users
        </p>
      </div>

      {/* SEARCH */}
      <div className="flex items-center bg-white rounded-xl shadow px-4 py-3 mb-6 max-w-xl">
        <FaSearch className="text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="Search users..."
          className="w-full outline-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-2xl shadow overflow-hidden">

        <div className="grid grid-cols-6 bg-gray-50 text-xs font-semibold px-6 py-4 text-gray-600">
          <span>#</span>
          <span>User</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Status</span>
          <span className="text-center">Actions</span>
        </div>

        {filteredUsers.map((u, i) => (
          <div
            key={u._id}
            className="grid grid-cols-6 items-center px-6 py-4 border-b hover:bg-gray-50 transition"
          >
            <span className="text-gray-600">{i + 1}</span>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-500 text-white flex items-center justify-center rounded-full text-sm">
                {u.name?.charAt(0)}
              </div>
              <span className="font-medium">{u.name}</span>
            </div>

            <span className="text-gray-600 text-sm">{u.email}</span>
            <span className="text-gray-600 text-sm">{u.phone || "N/A"}</span>

            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full w-fit">
              Active
            </span>

            <div className="flex justify-center gap-2">
              <button
                onClick={() => openEdit(u)}
                className="bg-blue-100 text-blue-600 p-2 rounded hover:bg-blue-200"
              >
                <FaUserEdit />
              </button>

              <button
                onClick={() => handleDelete(u._id)}
                className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">

        {filteredUsers.map((u, i) => (
          <div
            key={u._id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
          >

            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
                  {u.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
              </div>

              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Active
              </span>
            </div>

            <div className="mt-3 text-sm text-gray-600">
              <p>📞 {u.phone || "N/A"}</p>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => openEdit(u)}
                className="flex-1 bg-blue-500 text-white py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(u._id)}
                className="flex-1 bg-red-500 text-white py-1 rounded"
              >
                Delete
              </button>
            </div>

          </div>
        ))}

      </div>

      {/* EDIT MODAL */}
      {editUser && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4">

          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-lg">

            <h3 className="text-lg font-semibold mb-4">Edit User</h3>

            <input
              className="w-full border p-2 mb-3 rounded"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              className="w-full border p-2 mb-3 rounded"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <input
              className="w-full border p-2 mb-4 rounded"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setEditUser(null)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminUsers;