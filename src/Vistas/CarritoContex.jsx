import { createContext, useState } from "react";
import { logSecurityEvent } from "../Back/securityLog";

export const CartContext = createContext();

const safeLoadCart = () => {
  const raw = localStorage.getItem("cart");

  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      logSecurityEvent("INVALID_CART_SHAPE", {
        reason: "not_array",
        rawSnippet: String(raw).slice(0, 80),
      });
      return [];
    }

    return parsed;
  } catch (err) {
    logSecurityEvent("INVALID_CART_JSON", {
      message: err instanceof Error ? err.message : String(err),
      rawSnippet: String(raw).slice(0, 80),
    });
    return [];
  }
};


export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(safeLoadCart);

  const addItem = (item) => {
    const updated = [...cart, item];
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cart.filter((i) => i.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};
