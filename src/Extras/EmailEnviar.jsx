import emailjs from "emailjs-com";
import Swal from "sweetalert2";
import { wasa_email } from "../Back/emaill_data";

// Helper para sanear texto controlado por el cliente antes de mandarlo al servicio de correo
const sanitizeText = (value, maxLen = 120) =>
  String(value ?? "")
    .replace(/[\r\n]+/g, " ") 
    .trim()
    .slice(0, maxLen);

// Función para enviar el correo de confirmación
const sendConfirmationEmail = (cart, total, buyer, showAlert) => {
  const orderId = Math.floor(Math.random() * 1000000);

  // Armar los detalles de la orden para EmailJS (sanitizados)
  const orderDetails = cart.map((item) => ({
    image_url: sanitizeText(item.imagen, 200),
    name: sanitizeText(item.nombre, 80),
    units: item.quantity,
    price: (item.precio * item.quantity).toFixed(2),
  }));

  // Sanitizar el correo de contacto del comprador
  const safeEmail = sanitizeText(buyer.contactValue, 120);


  const emailParams = {
    order_id: orderId,
    email: safeEmail,
    orders: orderDetails,
    cost: {
      shipping: "0.00",
      tax: "0.00",
      total: total.toFixed(2),
    },
  };

  // Enviar el correo con EmailJS
  return emailjs
    .send(
      wasa_email.servicio, 
      wasa_email.template, 
      emailParams,
      wasa_email.llave 
    )
    .then(() => {
      console.log("Correo enviado con éxito");
      Swal.fire({
        icon: "success",
        title: "¡Gracias por tu compra!",
        text: "Se ha enviado un correo con la confirmación de tu pedido.",
      });
    })
    .catch((error) => {
      console.error("Error al enviar el correo:", error);
      showAlert("Error al enviar el correo", "danger");
    });
};

export default sendConfirmationEmail;
