import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
   const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Message sent successfully ✅");
      setFormData({ name: "", email: "", message: "" });
    } else {
      alert(data.message || "Failed to send message ❌");
    }
  } catch (err) {
    console.error(err);
    alert("Server error ❌");
  }
};
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 py-10 px-4">
      
      {/* Heading */}
      <motion.h1
        className="text-4xl font-bold text-center text-white mb-10"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Contact Us
      </motion.h1>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        
        {/* LEFT - Contact Info */}
        <motion.div
          className="bg-white/10 backdrop-blur-md p-6 rounded-2xl text-white"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>

          <p className="mb-4">
            We’d love to hear from you! Reach out for custom printing solutions.
          </p>

          <div className="space-y-3">
            <p className="flex items-center gap-2">
              <FaEnvelope /> support@printifyhub.com
            </p>
            <p className="flex items-center gap-2">
              <FaPhone /> +91 9876543210
            </p>
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt /> Sagar, SHIVMOGA(D) , India
            </p>
          </div>
        </motion.div>

        {/* RIGHT - Form */}
        <motion.div
          className="bg-white shadow-2xl rounded-2xl p-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows="4"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg hover:opacity-90 transition">
              Send Message
            </button>
          </form>
        </motion.div>
      </div>

      {/* MAP SECTION */}
      <div className="max-w-6xl mx-auto mt-10">
        <iframe
          title="map"
          src="https://www.google.com/maps?q= Sagar,Shivmoga,Karnataka&output=embed"
          className="w-full h-64 rounded-2xl border-0"
          loading="lazy"
        ></iframe>
      </div>

    </div>
  );
}