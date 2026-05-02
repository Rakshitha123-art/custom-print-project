import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaTrash, FaShoppingCart } from "react-icons/fa";

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
    await axios.delete(`http://localhost:5000/api/designs/${id}`);
    fetchDesigns();
  };

  const handleBuyNow = (design) => {
    localStorage.setItem(
      "customDesign",
      JSON.stringify({
        designId: design._id,
        previewImage: design.previewImage,
        name: design.name,
      })
    );
    navigate("/placeorder");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 py-10 px-4">

      {/* HEADER */}
      <h1 className="text-4xl font-extrabold text-white text-center mb-12 tracking-wide">
        🎨 My Designs
      </h1>

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto">

        {/* EMPTY */}
        {designs.length === 0 && (
          <div className="text-center text-white mt-20">
            <h2 className="text-2xl font-semibold">No Designs Yet 😢</h2>
            <p className="opacity-70 mt-2">Start creating your first design!</p>

            <button
              onClick={() => navigate("/customize")}
              className="mt-6 bg-white text-black px-6 py-2 rounded-xl font-semibold hover:scale-105 transition"
            >
              Create Design
            </button>
          </div>
        )}

        {/* GRID */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">

          {designs.map((d) => (
            <div
              key={d._id}
              className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-2 transition duration-300 overflow-hidden"
            >

              {/* IMAGE */}
              <div className="h-64 bg-black/20 flex items-center justify-center overflow-hidden">
                <img
                  src={d.previewImage}
                  alt="design"
                  className="h-full w-full object-contain p-4 group-hover:scale-110 transition duration-300 drop-shadow-xl"
                />
              </div>

              {/* INFO */}
              <div className="p-4 text-white">

                <h2 className="font-semibold text-lg truncate">
                  {d.name || "Untitled Design"}
                </h2>

                <p className="text-xs opacity-70 mb-3">
                  {new Date(d.createdAt).toLocaleDateString()}
                </p>

                {/* ICON BUTTONS */}
                <div className="flex justify-between items-center">

                  {/* VIEW */}
                  <button
                    onClick={() => setSelectedImg(d.previewImage)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 py-2 rounded-lg flex items-center justify-center text-white"
                    title="View"
                  >
                    <FaEye />
                  </button>

                  {/* RIGHT SIDE ICONS */}
                  <div className="flex gap-2 ml-2">

                    {/* BUY */}
                    <button
                      onClick={() => handleBuyNow(d)}
                      className="bg-green-500 hover:bg-green-600 p-2 rounded-full text-white shadow-lg hover:scale-110 transition"
                      title="Buy Now"
                    >
                      <FaShoppingCart />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => deleteDesign(d._id)}
                      className="bg-red-500 hover:bg-red-600 p-2 rounded-full text-white shadow-lg hover:scale-110 transition"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>

                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FULL SCREEN VIEW */}
      {selectedImg && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">

          <img
            src={selectedImg}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl animate-fadeIn"
          />

          <button
            onClick={() => setSelectedImg(null)}
            className="absolute top-6 right-6 bg-white text-black px-4 py-1 rounded-full text-lg hover:scale-110 transition"
          >
            ✕
          </button>

        </div>
      )}

    </div>
  );
}

export default MyDesigns;