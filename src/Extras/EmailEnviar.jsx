import Swal from "sweetalert2";

// Función segura para solicitar al backend que envíe el correo
const sendConfirmationEmail = async (cart, total, buyer, showAlert) => {
  try {
    // Enviar SOLO los datos necesarios al backend
    const response = await fetch("/api/send-confirmation-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cart,
        total,
        email: buyer.cozntactValue,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al enviar la solicitud al backend");
    }

    console.log("Solicitud de envío de correo enviada al backend");

    Swal.fire({
      icon: "success",
      title: "¡Gracias por tu compra!",
      text: "Se ha enviado un correo con la confirmación de tu pedido.",
    });

  } catch (error) {
    console.error("Error al solicitar el envío del correo:", error);
    showAlert("Error al enviar el correo", "danger");
  }
};

export default sendConfirmationEmail;
