import React, { useContext } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "reactstrap";
import { LanguageContext } from "./LanguageContext"; // Ajusta según tu ruta
import "./modal.css";

function ModalDetalles({ isOpen, closeModal, elemento }) {
  const { language } = useContext(LanguageContext);
  const t = {
    es: {
      orderDetails: "Detalles de la Orden",
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
    },
    en: {
      orderDetails: "Order Details",
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
  }[language];

  if (!isOpen) return null;

  const isOrder = Array.isArray(elemento?.productos);
  let dateStr = t.notRegistered;

  if (isOrder && elemento.fecha) {
    dateStr =
      typeof elemento.fecha.toDate === "function"
        ? elemento.fecha.toDate().toLocaleDateString()
        : new Date(elemento.fecha).toLocaleDateString();
  }

  return (
    <Modal isOpen={true} toggle={closeModal} backdrop="static">
      <ModalHeader toggle={closeModal}>
        {isOrder ? t.orderDetails : t.productDetails}
      </ModalHeader>

      <ModalBody className="cuerpoModal">
        <div className="container">
          {isOrder ? (
            <div className="row mb-3">
              <div className="col-6">
                <h5>{t.buyerInfo}</h5>
                <p><strong>{t.name}:</strong> {elemento.buyer?.name || "-"}</p>
                {elemento.buyer?.contactType === "email" ? (
                  <p><strong>{t.email}:</strong> {elemento.buyer.contactValue}</p>
                ) : (
                  <p><strong>{t.phone}:</strong> {elemento.buyer.contactValue}</p>
                )}
                <p><strong>{t.address}:</strong> {elemento.buyer?.address || "-"}</p>
                <p><strong>{t.paymentMethod}:</strong> {elemento.buyer?.paymentMethod || "-"}</p>
                <p><strong>{t.date}:</strong> {dateStr}</p>
                <p><strong>{t.total}:</strong> ${elemento?.total}</p>
              </div>
              <div className="col-6">
                <h5>{t.products}</h5>
                {elemento.productos.length > 0 ? (
                  elemento.productos.map((prod, i) => (
                    <div key={i} className="mb-2 border-bottom pb-2">
                      <p className="mb-1"><strong>{prod.nombre}</strong></p>
                      <p className="mb-1">{t.quantity}: {prod.cantidad}</p>
                      <p className="mb-1">{t.unitPrice}: ${prod.precio.toFixed(2)}</p>
                      <p className="mb-0">{t.productTotal}: ${(prod.cantidad * prod.precio).toFixed(2)}</p>
                    </div>
                  ))
                ) : (
                  <p>{t.noProducts}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center">
              {elemento.imagen && (
                <img
                  src={elemento.imagen}
                  alt={elemento.nombre}
                  className="img-fluid mb-3"
                  style={{ maxHeight: 120 }}
                />
              )}
              <h5>{elemento.nombre}</h5>
              <p className="text-success fw-bold">
                ${(elemento.precio * (1 - (elemento.descuento || 0) / 100)).toFixed(2)}
              </p>

              <div className="text-start">
                <h6>{t.description}</h6>
                <p>
                  {language === "es"
                    ? (elemento.descripcionES || "–")
                    : (elemento.descripcionEN || "–")}
                </p>


                {Array.isArray(elemento.ingredientes) && elemento.ingredientes.length > 0 && (
                  <>
                    <h6>{t.ingredients}</h6>
                    <ul className="ps-3">
                      {elemento.ingredientes.map((ing, idx) => <li key={idx}>{ing}</li>)}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={closeModal}>{t.accept}</Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalDetalles;
