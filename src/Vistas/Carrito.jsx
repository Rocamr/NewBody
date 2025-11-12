import React, { useContext, useMemo, useState } from "react";
import { CartContext } from "./CarritoContex";
import { LanguageContext } from "../Extras/LanguageContext";
import { db } from "../Back/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button, Container, Form, Row, Col, Card, Badge } from "react-bootstrap";
import "./carrito.css";
import logo from "../Vistas/logoim.png";
import TopNavBar from "../Extras/navbar";
import CustomAlert from "../Extras/alert";
import emailjs from "@emailjs/browser";
import { useConfirm } from "../Extras/useConfirm";
import Footer from "../Extras/piedePagina";
import { wasa_email } from "../Back/emaill_data";
import { translations, useCartTotals } from "../Extras/extras";

// Inicializa EmailJS
emailjs.init("vxwWEgSHF-XKCfOIf");

export default function Cart() {
  const { cart, increase, decrease, removeFromCart, clearCart } = useContext(CartContext);
  const { language } = useContext(LanguageContext);
  const [alertState, setAlertState] = useState({ isOpen: false, texto: "", tipo: "" });
  const [openConfirm, ConfirmDialog] = useConfirm();

  const [buyer, setBuyer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "",
    shippingMethod: ""
  });
  const textos = translations[language];
  const showAlert = (texto, tipo, duration = 2000) => {
    setAlertState({ isOpen: true, texto, tipo });
    setTimeout(() => setAlertState({ isOpen: false, texto: "", tipo: "" }), duration);
  };
  const { subtotal, shippingCost, total } = useMemo(() => {
    const calcularCostoEnvio = (pais, total) => {
      if (!pais || isNaN(total)) return 0;
      switch (pais.toLowerCase()) {
        case 'costa rica':
          return total * 0.1;
        default:
          return total * 0.2;
      }
    }
    const st = cart.reduce((sum, i) => sum + i.precio * i.quantity, 0);
    const sc = calcularCostoEnvio(buyer.country, st);
    return {
      subtotal: st,
      shippingCost: isNaN(sc) ? 0 : sc,
      total: st + (isNaN(sc) ? 0 : sc)
    };
  }, [cart, buyer.country]);

  const generarMensaje = (format) => {
    const productosTexto = cart.map(i => `${i.nombre} x${i.quantity}`).join(', ');

    if (format === 'texto') {
      return language === 'es'
        ? `Hola, mi nombre es ${buyer.name}. Estoy interesado en comprar estos productos: ${productosTexto}. Total: $${total.toFixed(2)}. Para contactar, llamar al: ${buyer.phone}`
        : `Hi, my name is ${buyer.name}. I’m interested in buying these products: ${productosTexto}. Total: $${total.toFixed(2)}. To contact, call: ${buyer.phone}`;
    } else {
      return language === 'es'
        ? `<p><strong>Nombre:</strong> ${buyer.name}</p>
         <p><strong>Correo:</strong> ${buyer.email}</p>
         <p><strong>Teléfono:</strong> ${buyer.phone}</p>
         <p><strong>País:</strong> ${buyer.country || "No especificado"}</p>
         <p><strong>Dirección:</strong> ${buyer.address}</p>
         <p><strong>Método de pago:</strong> ${buyer.paymentMethod}</p>
         <p><strong>Envío:</strong> ${buyer.shippingMethod || "No especificado"}</p>
         <p><strong>Productos:</strong> ${productosTexto}</p>
         <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
         <p><strong>Envío:</strong> $${shippingCost.toFixed(2)}</p>
         <p><strong>Total:</strong> $${total.toFixed(2)}</p>`
        : `<p><strong>Name:</strong> ${buyer.name}</p>
         <p><strong>Email:</strong> ${buyer.email}</p>
         <p><strong>Phone:</strong> ${buyer.phone}</p>
         <p><strong>Country:</strong> ${buyer.country || "Not specified"}</p>
         <p><strong>Address:</strong> ${buyer.address}</p>
         <p><strong>Payment method:</strong> ${buyer.paymentMethod}</p>
         <p><strong>Shipping:</strong> ${buyer.shippingMethod || "Not specified"}</p>
         <p><strong>Products:</strong> ${productosTexto}</p>
         <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
         <p><strong>Shipping:</strong> $${shippingCost.toFixed(2)}</p>
         <p><strong>Total:</strong> $${total.toFixed(2)}</p>`;
    }
  };

  const handleClear = async () => {
    if (await openConfirm(textos.cart.clearConfirm)) {
      clearCart();
      showAlert(textos.cart.emptyCart, 'info');
    }
  };

  const handleBuy = async () => {
    if (!cart.length) return showAlert(textos.cart.emptyCart, 'warning');

    // Validación de campos obligatorios
    if (!buyer.name.trim() || !buyer.email.trim() || !buyer.phone.trim()) {
      return showAlert(language === 'en'
        ? 'Please fill in your name, email and phone number'
        : 'Por favor completa tu nombre, correo y teléfono', 'danger');
    }

    try {
      // Guardar orden en Firestore
      await addDoc(collection(db, 'Ordenes'), {
        buyer,
        productos: cart.map(i => ({
          id: i.id,
          nombre: i.nombre,
          cantidad: i.quantity,
          precio: i.precio
        })),
        subtotal,
        shippingCost,
        total,
        fecha: serverTimestamp()
      });

      showAlert(textos.cart.orderSuccess, 'success');

      // WhatsApp (mensaje al número fijo de la tienda)
      const whatsappNumber = wasa_email.numero;
      console.log('Numero',wasa_email.numero)
      const mensajeWA = `🛒 *NUEVO PEDIDO*

👤 *Cliente:* ${buyer.name}
📧 *Correo:* ${buyer.email}
📞 *Teléfono:* ${buyer.phone}
🌍 *País:* ${buyer.country}
🏠 *Dirección:* ${buyer.address}
💳 *Pago:* ${buyer.paymentMethod}
🚚 *Envío:* ${buyer.shippingMethod || "No especificado"}
📦 *Productos:*
${cart.map(item => `• ${item.nombre} x${item.quantity} ($${(item.precio * item.quantity).toFixed(2)})`).join('\n')}
💰 *Subtotal:* $${subtotal.toFixed(2)}
🚚 *Envío:* $${shippingCost.toFixed(2)}
🧾 *Total:* $${total.toFixed(2)}`;

      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensajeWA)}`;
      console.log(whatsappURL);
      const win = window.open(whatsappURL, '_blank');
      if (!win) alert("Permite las ventanas emergentes para continuar con el pedido por WhatsApp.");

      // Email
      const emailParams = {
        order_id: `ORD-${Date.now()}`,
        logo: logo,
        orders: cart.map(item => ({
          image_url: item.imagen,
          name: item.nombre,
          units: item.quantity,
          price: `$${item.precio.toFixed(2)}`
        })),
        cost: {
          shipping: `$${shippingCost.toFixed(2)}`,
          tax: "$0.00",
          total: `$${total.toFixed(2)}`
        },
        email: buyer.email,
        name: buyer.name,
        phone: buyer.phone
      };

      await emailjs.send("service_l95ga6w", "template_lbq7vwr", emailParams);

      showAlert(textos.alerts.buysucces,        'success'      );

      clearCart();
    } catch (error) {
      console.error('Error al procesar la orden:', error);
      showAlert(textos.alerts.buysucces, 'danger');
    }
  };
  return (
    <Container className="py-4 cart-container">
      <TopNavBar />
      <h2 className="mb-4 text-primary">{textos.cart.cartTitle}</h2>
      {alertState.isOpen && <CustomAlert isOpen={alertState.isOpen} texto={alertState.texto} tipo={alertState.tipo} timeout={300} />}

      {!cart.length
        ? <p className="text-muted">({textos.cart.empty})</p>
        : <>
          <Row className="g-3 mb-4">
            {cart.map(item => (
              <Col md={6} lg={4} key={item.id}>
                <Card className="h-100 shadow-sm d-flex flex-row">
                  <div style={{ padding: '0.5rem' }}>
                    <img src={item.imagen} alt={item.nombre} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="d-flex justify-content-between">
                      {item.nombre}<Badge bg="secondary">${item.precio}</Badge>
                    </Card.Title>
                    <Card.Text>
                      {textos.cart.quantity}: {item.quantity}<br />
                      Subtotal: ${item.precio * item.quantity}
                    </Card.Text>
                    <div className="d-flex gap-2 mt-auto">
                      <Button size="sm" variant="outline-success" onClick={() => increase(item.id)}>+</Button>
                      <Button size="sm" variant="outline-warning" onClick={() => item.quantity === 1 ? removeFromCart(item.id) : decrease(item.id)}>–</Button>
                      <Button size="sm" variant="outline-danger" onClick={() => removeFromCart(item.id)}>🗑</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <hr />
          <h4 className="mb-3">📋</h4>
          <Form className="mb-4">
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="buyerName">
                  <Form.Label>{textos.cart.buyerName}</Form.Label>
                  <Form.Control type="text" placeholder={textos.cart.buyerName} value={buyer.name} onChange={e => setBuyer({ ...buyer, name: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="buyerPhone">
                  <Form.Label>{textos.cart.contactPhone}</Form.Label>
                  <Form.Control type="text" placeholder={textos.cart.contactPhone} value={buyer.phone} onChange={e => setBuyer({ ...buyer, phone: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="buyerEmail">
                  <Form.Label>{textos.cart.contactEmail}</Form.Label>
                  <Form.Control type="email" placeholder={textos.cart.contactEmail} value={buyer.email} onChange={e => setBuyer({ ...buyer, email: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="buyerCountry">
                  <Form.Label>{textos.cart.country}</Form.Label>
                  <Form.Select value={buyer.country} onChange={e => setBuyer({ ...buyer, country: e.target.value })}>
                    <option value="">Seleccione un país</option>
                    <option value="Costa Rica">Costa Rica</option>
                    <option value="Estados Unidos">Estados Unidos</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="buyerAddress">
                  <Form.Label>{textos.cart.address}</Form.Label>
                  <Form.Control type="text" placeholder={textos.address} value={buyer.address} onChange={e => setBuyer({ ...buyer, address: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="paymentMethod">
                  <Form.Label>{textos.cart.payment}</Form.Label>
                  <Form.Select value={buyer.paymentMethod} onChange={e => setBuyer({ ...buyer, paymentMethod: e.target.value })}>
                    <option value="">Seleccione un método</option>
                    <option value="Transferencia bancaria">Transferencia bancaria</option>
                    <option value="Contra entrega">Contra entrega</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Sinpe Móvil">Sinpe Móvil</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="shippingMethod">
                  <Form.Label>{textos.cart.shipping}</Form.Label>
                  <Form.Select value={buyer.shippingMethod} onChange={e => setBuyer({ ...buyer, shippingMethod: e.target.value })}>
                    <option value="Correos de Costa Rica">Correos de Costa Rica</option>
                    <option value="DHL">DHL</option>
                    <option value="FedEx">FedEx</option>
                    <option value="UPS">UPS</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
          <div>
            <p><strong>{textos.cart.orderSubtotal}:</strong> ${subtotal.toFixed(2)}</p>
            <p><strong>{textos.cart.shippingCost}:</strong> ${shippingCost.toFixed(2)}  *{textos.cart.envio}</p>
            <p><strong>{textos.cart.total}:</strong> ${total.toFixed(2)}</p>
          </div>
          <div className="d-flex gap-3">
          <Button size="lg"  onClick={handleClear} variant="outline-secondary">{textos.cart.clearConfirm}</Button>
            <Button size="lg"  onClick={handleBuy} variant="outline-secondary">{textos.cart.buyButton}</Button>
          </div>
        </>
      }

      <ConfirmDialog />
      <Footer />
    </Container>
  );
}