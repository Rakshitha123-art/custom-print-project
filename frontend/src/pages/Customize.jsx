import React, { useEffect, useRef, useState, useContext } from "react";
import { fabric } from "fabric";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import tshirtImg from "../assets/tshirt.png";
import mugImg from "../assets/mug.png";
import {
  FaArrowLeft,
  FaUndo,
  FaRedo,
  FaDownload,
  FaTextHeight,
  FaImage,
  FaPaintBrush,
  FaTrash,
  FaSave,
  FaShoppingCart,
  FaTshirt,
  FaMugHot,
} from "react-icons/fa";
import { CartContext } from "../context/CartContext";

function Customize() {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState("tshirt");
  const [color, setColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(42);
  const [drawing, setDrawing] = useState(false);

  const products = {
    tshirt: {
      name: "Custom T-Shirt",
      price: 499,
      image: tshirtImg,
      theme: "from-indigo-600 to-purple-600",
      btn: "bg-purple-600",
    },
    mug: {
      name: "Custom Mug",
      price: 299,
      image: mugImg,
      theme: "from-emerald-500 to-teal-500",
      btn: "bg-emerald-600",
    },
  };

  const current = products[product];

  // ---------------- INIT ----------------
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 600,
      backgroundColor: "#f8fafc",
    });

    fabricRef.current = canvas;

    loadProduct("tshirt");

    return () => canvas.dispose();
  }, []);

  useEffect(() => {
    if (fabricRef.current) {
      loadProduct(product);
    }
  }, [product]);

  const loadProduct = (type) => {
    const canvas = fabricRef.current;
    canvas.clear();

    fabric.Image.fromURL(products[type].image, (img) => {
      img.scaleToWidth(350);

      img.set({
        left: 250,
        top: 280,
        originX: "center",
        originY: "center",
        selectable: false,
        evented: false,
      });

      canvas.add(img);
      img.sendToBack();

      const printArea = new fabric.Rect({
        left: 170,
        top: 180,
        width: 160,
        height: 160,
        fill: "transparent",
        stroke: type === "mug" ? "#10b981" : "#6366f1",
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
      });

      canvas.add(printArea);
      canvas.renderAll();
    });
  };

  // ---------------- TOOLS ----------------
  const addText = () => {
    const text = new fabric.Textbox("Edit me", {
      left: 250,
      top: 250,
      fontSize,
      fill: color,
      originX: "center",
      originY: "center",
      fontWeight: "bold",
    });

    fabricRef.current.add(text);
    fabricRef.current.setActiveObject(text);
  };

  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      fabric.Image.fromURL(reader.result, (img) => {
        img.scaleToWidth(100);

        img.set({
          left: 250,
          top: 250,
          originX: "center",
          originY: "center",
        });

        fabricRef.current.add(img);
        fabricRef.current.setActiveObject(img);
      });
    };

    reader.readAsDataURL(file);
  };

  const toggleDraw = () => {
    const canvas = fabricRef.current;
    canvas.isDrawingMode = !drawing;

    if (!drawing) {
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = 3;
    }

    setDrawing(!drawing);
  };

  const deleteObject = () => {
    const active = fabricRef.current.getActiveObject();
    if (active) fabricRef.current.remove(active);
  };

  const updateText = (key, value) => {
    const active = fabricRef.current.getActiveObject();
    if (!active) return;

    active.set({ [key]: value });
    fabricRef.current.renderAll();
  };

  // ---------------- ACTIONS ----------------
  const downloadPNG = () => {
    const url = fabricRef.current.toDataURL({
      format: "png",
    });

    const a = document.createElement("a");
    a.href = url;
    a.download = "design.png";
    a.click();
  };

  const saveDesign = async () => {
  try {
    const image = fabricRef.current.toDataURL({
      format: "jpeg",
      quality: 0.7,
    });

    const payload = {
      userId: localStorage.getItem("userId") || "guest",
      productId: product,
      name: product === "tshirt" ? "Custom T-Shirt" : "Custom Mug",
      previewImage: image,
      designData: fabricRef.current.toJSON(),
    };

    const res = await axios.post(
      "http://localhost:5000/api/designs",
      payload
    );

    console.log("Saved:", res.data);

    alert("Design Saved ✅");

    navigate("/my-designs");

  } catch (err) {
    console.error("Save error:", err);
    alert("Save failed ❌");
  }
};

  const addDesignToCart = async () => {
    const image = fabricRef.current.toDataURL({
      format: "jpeg",
      quality: 0.7,
    });

    await addToCart({
      _id: "custom-" + Date.now(),
      name: current.name,
      price: current.price,
      image,
      qty: 1,
      isCustom: true,
    });

    navigate("/cart");
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${current.theme} p-6`}>

      {/* TITLE */}
      <div className="text-center text-white mb-6">
        <h1 className="text-4xl font-bold">
          {product === "tshirt"
            ? "👕 T-SHIRT CUSTOMIZER"
            : "☕ MUG CUSTOMIZER"}
        </h1>
        <p className="text-xl">
          Design your own {product}
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-5">

        {/* TOP BAR */}
        <div className="flex justify-between mb-5">
          <button
            onClick={() => navigate(-1)}
            className="border px-4 py-2 rounded-xl flex gap-2"
          >
            <FaArrowLeft /> Back
          </button>

          <div className="flex gap-4">
            <button><FaUndo /></button>
            <button><FaRedo /></button>
          </div>

          <button
            onClick={downloadPNG}
            className="border px-4 py-2 rounded-xl flex gap-2"
          >
            <FaDownload /> Download
          </button>
        </div>

        {/* PRODUCT SWITCH */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setProduct("tshirt")}
            className={`px-4 py-2 rounded-xl ${
              product === "tshirt"
                ? "bg-purple-600 text-white"
                : "bg-gray-100"
            }`}
          >
            <FaTshirt />
          </button>

          <button
            onClick={() => setProduct("mug")}
            className={`px-4 py-2 rounded-xl ${
              product === "mug"
                ? "bg-emerald-600 text-white"
                : "bg-gray-100"
            }`}
          >
            <FaMugHot />
          </button>
        </div>

        <div className="flex gap-4">

          {/* LEFT TOOLBAR */}
          <div className="w-24 border rounded-2xl p-4 flex flex-col gap-5 items-center">
            <button onClick={addText}>
              <FaTextHeight />
              <p className="text-xs">Text</p>
            </button>

            <label className="cursor-pointer">
              <FaImage />
              <p className="text-xs">Image</p>
              <input
                hidden
                type="file"
                onChange={uploadImage}
              />
            </label>

            <button onClick={toggleDraw}>
              <FaPaintBrush />
              <p className="text-xs">Draw</p>
            </button>

            <button onClick={deleteObject}>
              <FaTrash />
              <p className="text-xs">Delete</p>
            </button>
          </div>

          {/* CANVAS */}
          <div className="flex-1 flex justify-center bg-gray-50 rounded-2xl p-4">
            <canvas ref={canvasRef} />
          </div>

          {/* RIGHT PANEL */}
          <div className="w-72 border rounded-2xl p-4">
            <h3 className="font-bold mb-3">Color</h3>

            <input
              type="color"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                updateText(
                  "fill",
                  e.target.value
                );
              }}
              className="w-full h-12"
            />

            <h3 className="font-bold mt-6 mb-2">
              Font Size
            </h3>

            <input
              type="range"
              min="10"
              max="80"
              value={fontSize}
              onChange={(e) => {
                setFontSize(
                  e.target.value
                );

                updateText(
                  "fontSize",
                  Number(
                    e.target.value
                  )
                );
              }}
              className="w-full"
            />
          </div>
        </div>

        {/* BOTTOM */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={saveDesign}
            className="border py-4 rounded-xl flex justify-center gap-2"
          >
            <FaSave />
            Save Design
          </button>

          <button
            onClick={addDesignToCart}
            className={`${current.btn} text-white py-4 rounded-xl flex justify-center gap-2`}
          >
            <FaShoppingCart />
            Add to Cart - ₹{current.price}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Customize;