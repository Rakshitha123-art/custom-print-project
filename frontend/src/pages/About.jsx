import React from "react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 py-10 px-4">
      
      {/* Heading */}
      <motion.h1
        className="text-4xl font-bold text-center text-white mb-10"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        About PrintifyHub
      </motion.h1>

      {/* Main Section */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        
        {/* LEFT - Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <img
            src="https://images.unsplash.com/photo-1607083206968-13611e3d76db"
            alt="printing"
            className="rounded-2xl shadow-2xl"
          />
        </motion.div>

        {/* RIGHT - Content */}
        <motion.div
          className="bg-white/10 backdrop-blur-md p-6 rounded-2xl text-white"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
          <p className="mb-4">
            PrintifyHub is your one-stop destination for custom printing solutions.
            We specialize in high-quality printing on t-shirts, mugs, hoodies, and more.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="mb-4">
            Our mission is to bring your creativity to life with premium prints,
            fast delivery, and affordable pricing.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
          <ul className="list-disc ml-5 space-y-2">
            <li>High-quality custom printing</li>
            <li>Affordable pricing</li>
            <li>Fast delivery</li>
            <li>Creative design support</li>
          </ul>
        </motion.div>
      </div>

      {/* STATS SECTION */}
      <div className="max-w-6xl mx-auto mt-12 grid md:grid-cols-3 gap-6 text-center">
        
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-xl"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-3xl font-bold text-blue-600">500+</h2>
          <p>Happy Customers</p>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-2xl shadow-xl"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-3xl font-bold text-purple-600">1000+</h2>
          <p>Products Printed</p>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-2xl shadow-xl"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-3xl font-bold text-pink-600">24/7</h2>
          <p>Customer Support</p>
        </motion.div>

      </div>

    </div>
  );
}