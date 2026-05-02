import { createContext, useState, useEffect, useCallback } from "react";
import api from "../api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // FETCH
  const fetchCart = useCallback(async () => {
    try {
      const res = await api.get("/api/cart");
      setCart(res.data.items || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // UPDATE QTY
  const updateQty = async (itemId, quantity) => {
    try {
      if (!itemId) return;
      if (quantity < 1) quantity = 1;

      await api.put(`/api/cart/${itemId}`, { quantity });
      await fetchCart();
    } catch (err) {
      console.log("QTY ERROR:", err.response?.data || err.message);
    }
  };

  // ADD
  const addToCart = async (item) => {
    try {
      console.log("ADDING TO CART:", item);
      await api.post("/api/cart", {
        productId: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        isCustom: item.isCustom,
      });

      await fetchCart();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // REMOVE
  const removeFromCart = async (itemId) => {
    try {
      await api.delete(`/api/cart/${itemId}`);
      await fetchCart();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        fetchCart,
        updateQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};