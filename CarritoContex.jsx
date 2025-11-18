import React, { createContext, useEffect, useState, useCallback } from "react";

// Seguridad: Hash para integridad del carrito
import { sha256 } from "js-sha256";

export const CartContext = createContext();

// -------------------------
//  SANITIZACIÓN
// -------------------------
const sanitizeString = (str) => {
  if (typeof str !== "string") return "";
  return str.replace(/[<>]/g, ""); // evita XSS simple
};

const sanitizeNumber = (num) => {
  const n = Number(num);
  return isNaN(n) || n < 0 ? 0 : n;
};

// -------------------------
//  VALIDACIÓN DE PRODUCTO
// -------------------------
const validateProduct = (product) => {
  if (!product || typeof product !== "object") return null;

  return {
    id: sanitizeString(product.id),
    nombre: sanitizeString(product.nombre),
    precio: sanitizeNumber(product.precio),
    imagen: sanitizeString(product.imagen),
  };
};

// -------------------------
//  VALIDACIÓN DE CANTIDAD
// -------------------------
const validateQuantity = (q) => {
  const num = Number(q);
  return num > 0 && num < 100 ? num : 1; // evita cantidades absurdas
};

// -------------------------
//  INTEGRIDAD DEL LOCALSTORAGE
// -------------------------
const CART_KEY = "secure_cart";
const HASH_KEY = "secure_cart_hash";

const verifyIntegrity = (cartStr) => {
  const storedHash = localStorage.getItem(HASH_KEY);
  const calculatedHash = sha256(cartStr);
  return storedHash === calculatedHash;
};

const saveIntegrity = (cartStr) => {
  localStorage.setItem(HASH_KEY, sha256(cartStr));
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (!stored) return [];

      // Validación del hash
      if (!verifyIntegrity(stored)) {
        console.warn("⚠ Carrito manipulado. Reiniciando.");
        localStorage.removeItem(CART_KEY);
        localStorage.removeItem(HASH_KEY);
        return [];
      }

      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];

      // Validación profunda de cada item
      return parsed
        .map((item) => {
          const safe = validateProduct(item);
          if (!safe) return null;
          return {
            ...safe,
            quantity: validateQuantity(item.quantity),
          };
        })
        .filter(Boolean);

    } catch (error) {
      console.error("Error cargando carrito:", error);
      return [];
    }
  });

  // -------------------------
  //  Guardar con integridad
  // -------------------------
  const saveCart = useCallback((newCart) => {
    const value =
      typeof newCart === "function" ? newCart(cart) : newCart;

    const stringified = JSON.stringify(value || []);

    localStorage.setItem(CART_KEY, stringified);
    saveIntegrity(stringified);

    setCart(value || []);
  }, [cart]);


  // -------------------------
  //  Métodos del carrito
  // -------------------------

  const addToCart = useCallback((product, quantity = 1) => {
    if (!product || !product.id || typeof product.id !== "string" || product.id.trim() === "") {
      return; 
    }
    const cleanProduct = validateProduct(product);
    const q = validateQuantity(quantity);
    if (!cleanProduct) return;

    saveCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === cleanProduct.id);

      if (exists) {
        return prevCart.map((item) =>
          item.id === cleanProduct.id
            ? { ...item, quantity: validateQuantity(item.quantity + q) }
            : item
        );
      }

      return [...prevCart, { ...cleanProduct, quantity: q }];
    });
  }, [saveCart]);
  const increase = useCallback((id) => {
    saveCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: validateQuantity(item.quantity + 1) }
          : item
      )
    );
  }, [saveCart]);
  const decrease = useCallback((id) => {
    saveCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity: Math.max(1, item.quantity - 1), // nunca baja de 1
          };
        }
        return item;
      })
    );
  }, [saveCart]);

  const removeFromCart = useCallback((id) => {
    saveCart((prevCart) => prevCart.filter((item) => item.id !== id));
  }, [saveCart]);



  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(HASH_KEY);
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, increase, decrease, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
