import React, { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaTextHeight,
  FaTrash,
  FaUndo,
  FaRedo,
  FaDownload,
} from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import { fabric } from "fabric";

function Customize() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [selected, setSelected] = useState(null);

  const [fontSize, setFontSize] = useState(28);
  const [color, setColor] = useState("#111111");

  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  // ================= CANVAS INIT =================
  useEffect(() => {
    if (!canvasRef.current) return;

    const c = new fabric.Canvas(canvasRef.current, {
      width: 350,
      height: 450,
      backgroundColor: "#ffffff",
    });

    // selection style
    c.selectionColor = "rgba(99,102,241,0.2)";
    c.selectionBorderColor = "#6366f1";

    setCanvas(c);

    // 🔥 Load T-shirt
    fabric.Image.fromURL("/tshirt.png", (img) => {
      img.scaleToWidth(350);
      img.set({ selectable: false, evented: false });
      c.setBackgroundImage(img, c.renderAll.bind(c));
    });

    // Print area
    const printArea = new fabric.Rect({
      left: 75,
      top: 120,
      width: 200,
      height: 200,
      fill: "transparent",
      stroke: "#6366f1",
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
    });

    c.add(printArea);

    // Selection tracking
    c.on("selection:created", (e) => setSelected(e.selected?.[0]));
    c.on("selection:updated", (e) => setSelected(e.selected?.[0]));
    c.on("selection:cleared", () => setSelected(null));

    return () => c.dispose();
  }, []);

  // ================= ACTIONS =================
  const addText = () => {
    if (!canvas) return;

    const text = new fabric.Textbox("Edit me", {
      left: 175,
      top: 225,
      originX: "center",
      originY: "center",
      fontSize,
      fill: color,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
  };

  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (!file || !canvas) return;

    const url = URL.createObjectURL(file);

    fabric.Image.fromURL(url, (img) => {
      img.set({
        left: 175,
        top: 225,
        originX: "center",
        originY: "center",
      });

      img.scaleToWidth(120);

      canvas.add(img);
      canvas.setActiveObject(img);
      URL.revokeObjectURL(url);
    });
  };

  const deleteObj = () => {
    const active = canvas?.getActiveObject();
    if (active) canvas.remove(active);
  };

  const update = (key, value) => {
    const active = canvas?.getActiveObject();
    if (!active) return;

    active.set({ [key]: value });
    canvas.renderAll();
  };

  const undo = () => canvas?.undo?.();
  const redo = () => canvas?.redo?.();

  const exportPNG = () => {
    const url = canvas?.toDataURL({ format: "png" });
    const a = document.createElement("a");
    a.href = url;
    a.download = "design.png";
    a.click();
  };

  // ================= ADD TO CART =================
  const addDesignToCart = async () => {
    if (!canvas) return;

    const image = canvas.toDataURL({
      format: "jpeg",
      quality: 0.6,
    });

    await addToCart({
      _id: "custom-" + Date.now(),
      name: "Customize Product",
      price: 499,
      image,
      qty: 1,
      isCustom: true,
    });

    navigate("/cart");
  };
  const saveDesign = async () => {
  if (!canvas) return;

  try {
    canvas.discardActiveObject();
    canvas.renderAll();

    // small preview (for listing)
    const preview = canvas.toDataURL({
      format: "jpeg",
      quality: 0.5,
      multiplier: 0.5,
    });

    // full design
    const designData = canvas.toJSON();

    const payload = {
      userId: localStorage.getItem("userId") || "guest",
      productId: "tshirt-01",
      designData,
      previewImage: preview,
    };

    await axios.post("http://localhost:5000/api/designs", payload);

    // 🔥 optional: store locally also
    localStorage.setItem("lastDesign", JSON.stringify(payload));

    alert("Design Saved ✅");

    navigate("/my-designs"); // 🔥 redirect

  } catch (err) {
    console.error(err);
    alert("Save failed ❌");
  }
};

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 text-white">

      {/* HEADER */}
      <div className="sticky top-0 bg-white/20 backdrop-blur-xl flex justify-between px-6 py-3 shadow">
        <h1 className="font-bold text-lg">🎨 Design Studio</h1>

        <div className="flex gap-4">
          <button onClick={undo}><FaUndo /></button>
          <button onClick={redo}><FaRedo /></button>
          <button onClick={exportPNG}><FaDownload /></button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex gap-6 p-6">

        {/* LEFT TOOLBAR */}
        <div className="w-24 bg-white/20 backdrop-blur-lg rounded-3xl flex flex-col items-center gap-6 py-6 shadow-xl">

          <button onClick={addText} className="p-3 bg-white text-black rounded-xl hover:scale-110">
            <FaTextHeight />
          </button>

          <label className="p-3 bg-white text-black rounded-xl cursor-pointer hover:scale-110">
            <input type="file" hidden onChange={uploadImage} />
            📷
          </label>

          <button onClick={deleteObj} className="p-3 bg-red-500 rounded-xl hover:scale-110">
            <FaTrash />
          </button>

        </div>

        {/* CANVAS */}
        <div className="flex-1 flex justify-center items-center">
          <div className="bg-white p-6 rounded-3xl shadow-2xl">
            <canvas ref={canvasRef} />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-80 bg-white/20 backdrop-blur-xl rounded-3xl p-6 space-y-6 shadow-xl">

          <h2 className="font-bold">⚙️ Settings</h2>

          {selected && (
            <>
              <div>
                <label>Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    setColor(e.target.value);
                    update("fill", e.target.value);
                  }}
                  className="w-full h-10"
                />
              </div>

              <div>
                <label>Font Size</label>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={fontSize}
                  onChange={(e) => {
                    setFontSize(e.target.value);
                    update("fontSize", Number(e.target.value));
                  }}
                  className="w-full"
                />
              </div>
            </>
          )}
           <button
    onClick={saveDesign}
    className="w-full bg-blue-600 py-3 rounded-xl"
  >
    💾 Save Design
  </button>


          <button
            onClick={addDesignToCart}
            className="w-full bg-black py-3 rounded-xl"
          >
            🛒 Add to Cart
          </button>

        </div>

      </div>
    </div>
  );
}

export default Customize;