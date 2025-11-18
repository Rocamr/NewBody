import { useMemo } from "react";
// src/components/translations.js
// Helper para escapar HTML (saneamiento en cliente)
export const escapeHtml = (unsafe) => {
  if (unsafe === null || unsafe === undefined) return "";
  const s = String(unsafe);
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Lista de idiomas soportados
const SUPPORTED_LANGS = ["es", "en"];
export const translations  = {
  es: {
    // Navbar
    navbar: {
      brand: "New Body CR",
      catalog: "Catálogo",
      cart: "Carrito",
      switchLang: "EN"
    },

    // Footer
    footer: {
      followUs: "Síguenos en redes sociales:",
      rights: "Todos los derechos reservados."
    },

    // Catálogo
    catalog: {
      title: "Catálogo de Productos",
      search: "Buscar…",
      sortBy: "Ordenar…",
      priceAsc: "Precio ↑",
      priceDesc: "Precio ↓",
      discountAsc: "Descuento ↑",
      discountDesc: "Descuento ↓",
      loadMore: "Ver más"
    },

    // Alertas
    alerts: {
      addedToCart: "agregado al carrito!",
      buysucces:"¡Orden generada! Se envió confirmación a tu correo y teléfono.",
      failbuy:"Error al procesar la orden",
      complete:"Por favor completa tu nombre, correo y teléfono"
    },

    // Carrito
    cart: {
      title: "Carrito de Compras",
      empty: "El carrito está vacío",
      quantity: "Cantidad",
      price: "Precio",
      buyButton: "Generar Orden",
      clearButton: "Vaciar Carrito",
      buyerName: "Nombre completo",
      envio: "El costo de envío es un estimado y puede variar según el destino.",
      contactMethod: "Contacto por",
      contactEmail: "Correo",
      contactPhone: "Teléfono",
      contactPlaceholder: "Ingresa tu",
      address: "Dirección",
      country: "País",
      selectCountry: "Seleccione un país",
      subtotalPerItem: "Subtotal",
      orderSubtotal: "Subtotal de la orden",
      shippingCost: "Costo de envío",
      total: "Total",
      payment: "Método de pago",
      shipping: "Sistema de envío preferido",
      whatsappMessage: "Me gustaría comprar:",
      orderSuccess: "¡Orden generada con éxito!",
      orderError: "Error al procesar la orden",
      formValidation: "Por favor completa tu nombre, correo y teléfono",
      removeConfirm: "¿Eliminar este producto?",
      clearConfirm: "¿Vaciar el carrito?"
    },
    //Modal detalles
    detalles: {
      title: "Detalles de la Orden",
      productDetails: "Detalles del Producto",
      buyerInfo: "Información del Comprador",
      name: "Nombre",
      email: "Email",
      phone: "Teléfono",
      address: "Dirección",
      paymentMethod: "Método de Pago",
      date: "Fecha",
      total: "Total",
      products: "Productos",
      quantity: "Cantidad",
      unitPrice: "Unitario",
      productTotal: "Total",
      noProducts: "No hay productos.",
      description: "Descripción",
      ingredients: "Ingredientes",
      accept: "Aceptar",
      notRegistered: "No registrado"
    }
  },

  en: {
    // Navbar
    navbar: {
      brand: "New Body CR",
      catalog: "Catalog",
      cart: "Cart",
      switchLang: "ES"
    },

    // Footer
    footer: {
      followUs: "Follow us on social media:",
      rights: "All rights reserved."
    },

    // Catalog
    catalog: {
      title: "Product Catalog",
      search: "Search…",
      sortBy: "Sort by…",
      priceAsc: "Price ↑",
      priceDesc: "Price ↓",
      discountAsc: "Discount ↑",
      discountDesc: "Discount ↓",
      loadMore: "Load more"
    },

    // Alerts
    alerts: {
      addedToCart: "added to cart!",
      buysucces:"Order placed! Confirmation sent to your email and phone.",
      failbuy:"Order processing failed",
      complete:"Please fill in your name, email and phone number"
    },

    // Cart
    cart: {
      title: "Shopping Cart",
      empty: "Your cart is empty",
      quantity: "Quantity",
      price: "Price",
      buyButton: "Place Order",
      clearButton: "Clear Cart",
      buyerName: "Full Name",
      envio: "Shipping cost is an estimate and may vary depending on destination.",
      contactMethod: "Contact via",
      contactEmail: "Email",
      contactPhone: "Phone",
      contactPlaceholder: "Enter your",
      address: "Address",
      country: "Country",
      selectCountry: "Select a country",
      subtotalPerItem: "Subtotal",
      orderSubtotal: "Order Subtotal",
      shippingCost: "Shipping Cost",
      total: "Total",
      payment: "Payment Method",
      shipping: "Preferred Shipping Method",
      whatsappMessage: "I would like to buy the following products:",
      orderSuccess: "Order placed successfully!",
      orderError: "Order processing failed",
      formValidation: "Please fill in your name, email and phone number",
      removeConfirm: "Do you want to remove this product?",
      clearConfirm: "Are you sure you want to clear the cart?"
    },
    //Modal detalles
    detalles: {
      title: "Order Details",
      productDetails: "Product Details",
      buyerInfo: "Buyer Information",
      name: "Name",
      email: "Email",
      phone: "Phone",
      address: "Address",
      paymentMethod: "Payment Method",
      date: "Date",
      total: "Total",
      products: "Products",
      quantity: "Quantity",
      unitPrice: "Unit Price",
      productTotal: "Total",
      noProducts: "No products.",
      description: "Description",
      ingredients: "Ingredients",
      accept: "Accept",
      notRegistered: "Not registered"
    }
  }
};
export const getSafeTranslations = (lang) => {
  const selected = SUPPORTED_LANGS.includes(lang) ? translations[lang] : translations["es"];
  // Recorrer y escapar solo valores string (recursively)
  const safeClone = (obj) => {
    if (obj === null || obj === undefined) return "";
    if (typeof obj === "string") return escapeHtml(obj);
    if (Array.isArray(obj)) return obj.map(safeClone);
    if (typeof obj === "object") {
      const out = {};
      for (const k of Object.keys(obj)) out[k] = safeClone(obj[k]);
      return out;
    }
    return String(obj);
  };
  return safeClone(selected);
};

// Validación simple de rutas internas: deben iniciar con "/" y no contener "//" que podría indicar esquema
export const isValidInternalPath = (p) => {
  if (!p || typeof p !== "string") return false;
  // Reject absolute URLs or suspicious sequences
  if (p.startsWith("http://") || p.startsWith("https://")) return false;
  if (!p.startsWith("/")) return false;
  if (p.includes("//")) return false;
  // Optionally: check allowed route patterns (regex)
  return true;
};

export const useCartTotals = (cart, country) => {
  const calcularCostoEnvio = (pais, total) => {
    if (!pais || isNaN(total)) return 0;
    switch (pais.toLowerCase()) {
      case "costa rica":
        return total * 0.1;
      default:
        return total * 0.2;
    }
  };

  return useMemo(() => {
    const subtotal = cart.reduce((sum, i) => sum + i.precio * i.quantity, 0);
    const shippingCost = calcularCostoEnvio(country, subtotal);
    return {
      subtotal,
      shippingCost,
      total: subtotal + shippingCost,
    };
  }, [cart, country]);
};

import { signOut } from "firebase/auth";
import { auth } from "../Back/firebase";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Primero salir de la ruta protegida
      navigate("/", { replace: true });

      // Luego cerrar sesión
      await signOut(auth);

      console.log("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <button onClick={handleLogout}>
      Cerrar sesión
    </button>
  );
}
