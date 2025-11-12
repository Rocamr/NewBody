import { useState, useEffect } from "react";
import React from "react";
import { Alert } from "reactstrap";
import "./alert.css";

function CustomAlert({ isOpen, texto, tipo }) {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    setVisible(isOpen); // Actualizar visibilidad cuando isOpen cambia
  }, [isOpen]);

  const onDismiss = () => {
    setVisible(false);
  };

  return (
    <Alert className="custom-alert" color={tipo} isOpen={visible} toggle={onDismiss} timeout={300} >
      <p className="alert-heading">{texto}</p>
    </Alert>
  );
}

export default CustomAlert;
