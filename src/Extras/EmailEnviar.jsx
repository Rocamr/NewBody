import emailjs from "emailjs-com";
import Swal from "sweetalert2";
import { wasa_email} from "../Back/emaill_data";

// Función para enviar el correo de confirmación
const sendConfirmationEmail = (cart, total, buyer, showAlert) => {
  const orderId = Math.floor(Math.random() * 1000000);

  // Armar los detalles de la orden para EmailJS
  const orderDetails = cart.map(item => ({
    image_url: item.imagen,
    name: item.nombre,
    units: item.quantity,
    price: (item.precio * item.quantity).toFixed(2)
  }));

  // Parámetros para la plantilla de EmailJS
  const emailParams = {
    order_id: orderId,
    email: buyer.contactValue,
    orders: orderDetails,
    cost: {
      shipping: "0.00",
      tax: "0.00",
      total: total.toFixed(2)
    }
  };

  // Enviar el correo con EmailJS
  emailjs.send(
    wasa_email.servicio, // ID del servicio
    wasa_email.template, // ID de la plantilla
    emailParams,
    wasa_email.llave // User/public key
  )
  .then(() => {
    console.log("Correo enviado con éxito");
    Swal.fire({
      icon: "success",
      title: "¡Gracias por tu compra!",
      text: "Se ha enviado un correo con la confirmación de tu pedido.",
    });
  })
  .catch(error => {
    console.error("Error al enviar el correo:", error);
    showAlert("Error al enviar el correo", "danger");
  });
};

export default sendConfirmationEmail;
