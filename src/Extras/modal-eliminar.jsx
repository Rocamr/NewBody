// ModalEliminar.jsx
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import "./modal.css";

function ModalEliminar({ isOpen, closeModal, elemento, nombreCrud, onDelete }) {
  const handleEliminar = () => {
    onDelete();
    closeModal();
  };

  return (
    <Modal isOpen={isOpen} toggle={closeModal} backdrop="static">
      <ModalHeader toggle={closeModal}>
        Eliminar {nombreCrud}
      </ModalHeader>
      <ModalBody>
        ¿Realmente deseas eliminar: <strong>{elemento?.nombre}</strong>?
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={handleEliminar}>
          Eliminar
        </Button>
        <Button color="secondary" onClick={closeModal}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalEliminar;
