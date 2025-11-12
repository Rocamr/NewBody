import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import "./confirmacionModal.css"; // Aquí defines tus estilos custom

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  return (
    <Modal isOpen={isOpen} toggle={onCancel} backdrop="static">
      <ModalHeader toggle={onCancel}>Confirmación</ModalHeader>
      <ModalBody>
        <p>{message}</p>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onConfirm}>
          Sí
        </Button>
        <Button color="secondary" onClick={onCancel}>
          No
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmModal;
