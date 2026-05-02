import React, { useState } from "react";
import bgImage from "../assets/login-bg.png";
import { useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    console.log("LOGIN RESPONSE:", data);

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // ✅ ONLY TOKEN SYSTEM (IMPORTANT)
    if (!data.token) {
      alert("Login failed: token missing");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.user?.email || "");
    localStorage.setItem("isAdmin", data.user?.isAdmin || false);
    localStorage.setItem("user", JSON.stringify(data.user));

    console.log("TOKEN STORED:", data.token);

    if (data.user?.isAdmin) {
      navigate("/admin");
    } else {
      navigate("/");
    }

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    alert("Something went wrong");
  }
};

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl text-center mb-6 text-gray-800">
          PRINTIFY<span className="text-purple-600">HUB</span> LOGIN
        </h1>

        <form
          onSubmit=
            {handleLogin}
          
          className="space-y-4"
        >
          {/* Email */}
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm text-gray-600">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
              required
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>

          <p className="text-center mt-4">
            Don't have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}