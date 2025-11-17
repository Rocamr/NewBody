import React, { useContext } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "reactstrap";
import { LanguageContext } from "./LanguageContext";
import "./modal.css";
import { translations } from "./extras";

// Sanitizador muy simple para prevenir inyección accidental
const safeText = (value) =>
  typeof value === "string"
    ? value.replace(/[<>]/g, "") // evita mínimo HTML injection
    : typeof value === "number" || typeof value === "boolean"
    ? String(value)
    : "-";

// Verifica si una ruta de imagen es segura
const isSafeImageUrl = (url) => {
  if (typeof url !== "string") return false;
  try {
    const u = new URL(url, window.location.origin);
    // permitimos http, https y rutas relativas
    return ["http:", "https:", "data:"].includes(u.protocol);
  } catch {
    return false;
  }
};

function ModalDetalles({ isOpen, closeModal, elemento }) {
  const { language } = useContext(LanguageContext);
  const t = translations[language] || {};

  if (!isOpen || !elemento) return null;

  const isOrder = Array.isArray(elemento?.productos);

  /** ------------------------------
   *   Fecha segura
   * ------------------------------ */
  let dateStr = t.notRegistered || "-";
  if (isOrder && elemento.fecha) {
    try {
      const fechaFinal =
        typeof elemento.fecha.toDate === "function"
          ? elemento.fecha.toDate()
          : new Date(elemento.fecha);

      if (!isNaN(fechaFinal.getTime())) {
        dateStr = fechaFinal.toLocaleDateString();
      }
    } catch {
      dateStr = t.notRegistered || "-";
    }
  }

  return (
    <Modal isOpen={true} toggle={closeModal} backdrop="static">
      <ModalHeader toggle={closeModal}>
        {isOrder ? safeText(t.detalles.orderDetails) : safeText(t.detalles.productDetails)}
      </ModalHeader>

      <ModalBody className="cuerpoModal">
        <div className="container">
          {isOrder ? (
            /** ------------------------------
             *   MODO ORDEN / PEDIDO
             * ------------------------------ */
            <div className="row mb-3">
              <div className="col-6">
                <h5>{safeText(t.detalles.buyerInfo)}</h5>

                <p><strong>{t.detalles.name}:</strong> {safeText(elemento.buyer?.name)}</p>

                {elemento.buyer?.contactType === "email" ? (
                  <p><strong>{t.detalles.email}:</strong> {safeText(elemento.buyer?.contactValue)}</p>
                ) : (
                  <p><strong>{t.detalles.phone}:</strong> {safeText(elemento.buyer?.contactValue)}</p>
                )}

                <p><strong>{t.detalles.address}:</strong> {safeText(elemento.buyer?.address)}</p>
                <p><strong>{t.detalles.paymentMethod}:</strong> {safeText(elemento.buyer?.paymentMethod)}</p>
                <p><strong>{t.detalles.date}:</strong> {dateStr}</p>

                <p>
                  <strong>{t.detalles.total}:</strong> $
                  {Number(elemento?.total) > 0 ? Number(elemento.total).toFixed(2) : "0.00"}
                </p>
              </div>

              <div className="col-6">
                <h5>{safeText(t.products)}</h5>

                {Array.isArray(elemento.productos) && elemento.productos.length > 0 ? (
                  elemento.productos.map((prod, i) => {
                    const nombre = safeText(prod?.nombre);
                    const cantidad = Number(prod?.cantidad) > 0 ? prod.cantidad : 0;
                    const precio = Number(prod?.precio) > 0 ? prod.precio : 0;

                    return (
                      <div key={i} className="mb-2 border-bottom pb-2">
                        <p className="mb-1"><strong>{nombre}</strong></p>
                        <p className="mb-1">{t.detalles.quantity}: {cantidad}</p>
                        <p className="mb-1">{t.detalles.unitPrice}: ${precio.toFixed(2)}</p>
                        <p className="mb-0">
                          {t.detalles.productTotal}: {(cantidad * precio).toFixed(2)}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p>{safeText(t.noProducts)}</p>
                )}
              </div>
            </div>
          ) : (
            /** ------------------------------
             *   MODO PRODUCTO
             * ------------------------------ */
            <div className="text-center">
              {isSafeImageUrl(elemento.imagen) && (
                <img
                  src={elemento.imagen}
                  alt={safeText(elemento.nombre)}
                  className="img-fluid mb-3"
                  style={{ maxHeight: 120 }}
                  loading="lazy"
                />
              )}

              <h5>{safeText(elemento.nombre)}</h5>

              <p className="text-success fw-bold">
                $
                {(
                  Number(elemento.precio) *
                  (1 - (Number(elemento.descuento) || 0) / 100)
                ).toFixed(2)}
              </p>

              <div className="text-start">
                <h6>{safeText(t.detalles.description)}</h6>
                <p>
                  {safeText(
                    language === "es"
                      ? elemento.descripcionES || "–"
                      : elemento.descripcionEN || "–"
                  )}
                </p>

                {Array.isArray(elemento.ingredientes) &&
                  elemento.ingredientes.length > 0 && (
                    <>
                      <h6>{safeText(t.detalles.ingredients)}</h6>
                      <ul className="ps-3">
                        {elemento.ingredientes.map((ing, idx) => (
                          <li key={idx}>{safeText(ing)}</li>
                        ))}
                      </ul>
                    </>
                  )}
              </div>
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={closeModal}>
          {safeText(t.detalles.accept)}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalDetalles;
