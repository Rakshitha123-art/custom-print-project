import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";


const Products = [
  { id: 1, name: "Custom T-Shirt", price: 499 },
  { id: 2, name: "Printed Mug", price: 299 },
  { id: 3, name: "Hoodie", price: 999 },
];

export default function Product() {
  const { id } = useParams(); // ✅ get id from URL
  const { addToCart } = useContext(CartContext);

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return <h1>Product not found</h1>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 shadow-xl rounded-xl bg-white">
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <p className="text-lg">₹{product.price}</p>

        <button
          onClick={() => addToCart(product)}
          className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}