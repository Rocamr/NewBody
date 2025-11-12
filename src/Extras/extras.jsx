import { useMemo } from "react";
export const translations = {
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

    // Órdenes / Modal
    orders: {
      details: "Detalles de la Orden",
      productDetails: "Detalles del Producto",
      buyerInfo: "Información del Comprador",
      name: "Nombre",
      email: "Email",
      phone: "Teléfono",
      date: "Fecha",
      products: "Productos",
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

    // Orders / Modal
    orders: {
      details: "Order Details",
      productDetails: "Product Details",
      buyerInfo: "Buyer Information",
      name: "Name",
      email: "Email",
      phone: "Phone",
      date: "Date",
      products: "Products",
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
