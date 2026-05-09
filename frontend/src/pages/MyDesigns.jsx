import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaTrash,
  FaShoppingCart,
  FaPlus,
  FaPalette,
  FaTshirt,
  FaMugHot,
} from "react-icons/fa";

function MyDesigns() {
  const [designs, setDesigns] = useState([]);
  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId") || "guest";

  const fetchDesigns = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/designs/user/${userId}`
      );
      setDesigns(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, []);

  const deleteDesign = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/designs/${id}`
    );
    fetchDesigns();
  };

  const buyNow = (design) => {
    localStorage.setItem(
      "customDesign",
      JSON.stringify(design)
    );
    navigate("/placeorder");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 p-6">

      {/* HERO */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row justify-between items-center">

          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              🎨 My Designs
            </h1>
            <p className="text-white/70">
              View, manage and order your saved custom products
            </p>
          </div>

          <div className="flex gap-4 mt-5 md:mt-0">

            <div className="bg-white/20 px-6 py-4 rounded-2xl text-center text-white">
              <p className="text-2xl font-bold">
                {designs.length}
              </p>
              <p className="text-sm opacity-70">
                Total Designs
              </p>
            </div>

            <button
              onClick={() => navigate("/customize")}
              className="bg-white text-black px-6 py-4 rounded-2xl font-semibold flex items-center gap-2 hover:scale-105 transition"
            >
              <FaPlus />
              New Design
            </button>
          </div>
        </div>
      </div>

      {/* EMPTY */}
      {designs.length === 0 && (
        <div className="text-center text-white mt-20">
          <FaPalette className="text-6xl mx-auto mb-4 opacity-70" />
          <h2 className="text-2xl font-semibold">
            No saved designs yet
          </h2>
          <p className="opacity-70 mt-2">
            Create your first masterpiece
          </p>
        </div>
      )}

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

        {designs.map((d) => (
          <div
            key={d._id}
            className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden hover:-translate-y-2 hover:shadow-purple-500/30 transition"
          >

            {/* IMAGE */}
            <div className="h-72 bg-white/5 flex items-center justify-center p-5 overflow-hidden">
              <img
                src={d.previewImage}
                alt="design"
                className="h-full object-contain group-hover:scale-110 transition duration-500 cursor-pointer"
                onClick={() =>
                  setSelectedImg(d.previewImage)
                }
              />
            </div>

            {/* INFO */}
            <div className="p-5 text-white">

              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold truncate">
                  {d.name || "Untitled"}
                </h2>

                <span className="bg-white/20 px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                  {d.productId === "mug" ? (
                    <>
                      <FaMugHot /> Mug
                    </>
                  ) : (
                    <>
                      <FaTshirt /> T-Shirt
                    </>
                  )}
                </span>
              </div>

              <p className="text-xs text-white/60 mb-4">
                {new Date(
                  d.createdAt
                ).toLocaleDateString()}
              </p>

              {/* BUTTONS */}
              <div className="grid grid-cols-3 gap-2">

                <button
                  onClick={() =>
                    setSelectedImg(d.previewImage)
                  }
                  className="bg-blue-500 hover:bg-blue-600 py-3 rounded-xl flex justify-center"
                >
                  <FaEye />
                </button>

                <button
                  onClick={() =>
                    buyNow(d)
                  }
                  className="bg-green-500 hover:bg-green-600 py-3 rounded-xl flex justify-center"
                >
                  <FaShoppingCart />
                </button>

                <button
                  onClick={() =>
                    deleteDesign(d._id)
                  }
                  className="bg-red-500 hover:bg-red-600 py-3 rounded-xl flex justify-center"
                >
                  <FaTrash />
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FULLSCREEN PREVIEW */}
      {selectedImg && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">

          <img
            src={selectedImg}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
          />

          <button
            onClick={() =>
              setSelectedImg(null)
            }
            className="absolute top-6 right-6 text-white text-3xl bg-white/20 w-12 h-12 rounded-full"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default MyDesigns;