
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
    address:""
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // ================= LOAD PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/users/get/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const text = await res.text();
        const data = JSON.parse(text);

        console.log("PROFILE DATA:", data);

        setUser(data);

        // ✅ FIX IMAGE PATH
        if (data.image) {
          setPreview(`http://localhost:5000/uploads/${data.image}`);
        }
      } catch (err) {
        console.error("FETCH ERROR:", err);
      }
    };

    fetchProfile();
  }, []);

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // ================= IMAGE CHANGE =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file)); // preview before upload
    }
  };

  // ================= SAVE =================
  const handleSave = async () => {
  try {
    const token = localStorage.getItem("token"); // ✅ FIX 1

    console.log("TOKEN:", token);

    const formData = new FormData();

    if (user.name) formData.append("name", user.name);
    if (user.phone) formData.append("phone", user.phone);
    if (user.email) formData.append("email", user.email);
    if (user.address) formData.append("address", user.address);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await fetch("http://localhost:5000/api/users/update/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.log("SERVER ERROR:", errText);
      alert("Failed: " + res.status);
      return;
    }

    const data = await res.json(); // ✅ FIX 2

    console.log("UPDATED:", data);

    setUser(data);

    if (data.image) {
      setPreview(`http://localhost:5000/uploads/${data.image}`);
    }

    setImageFile(null);
    setIsEditing(false);

  } catch (err) {
    console.error(err);
    alert("Failed to update profile");
  }
};

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <div className="profile-wrapper">

        {/* SIDEBAR */}
        <div className="profile-sidebar">
          <div className="profile-user">

            <div className="profile-image-container">
              <img
                src={
                  preview
                    ? preview
                    : "https://via.placeholder.com/150"
                }
                alt="profile"
              />

              {isEditing && (
                <label className="image-upload">
                  <FaCamera />
                  <input type="file" onChange={handleImageChange} hidden />
                </label>
              )}
            </div>

            <h3>{user.name || "User"}</h3>
          </div>

          <ul className="profile-menu">
            <li><button onClick={() => navigate("/orders")}>My Orders</button></li>
            <li><button onClick={() => navigate("/wishlist")}>Wishlist</button></li>
            <li><button onClick={() => navigate("/address")}>Addresses</button></li>
            <li><button className="logout" onClick={handleLogout}>Logout</button></li>
          </ul>
        </div>

        {/* MAIN CONTENT */}
        <div className="profile-content">
          <h2>Personal Information</h2>

          <div className="profile-form">

            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={user.name || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={user.email || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>

            <div className="input-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={user.phone || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>

          </div>

          <div style={{ marginTop: "20px" }}>
            {!isEditing ? (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            ) : (
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;
