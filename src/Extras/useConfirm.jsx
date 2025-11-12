import { useState } from "react";
import ConfirmModal from "./confirmacionModal";

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: "",
    resolve: null,
    reject: null,
  });

  const openConfirm = (message) => {
    return new Promise((resolve, reject) => {
      setConfirmState({
        isOpen: true,
        message,
        resolve,
        reject,
      });
    });
  };

  const handleConfirm = () => {
    if (confirmState.resolve) {
      confirmState.resolve(true);
    }
    setConfirmState({
      isOpen: false,
      message: "",
      resolve: null,
      reject: null,
    });
  };

  const handleCancel = () => {
    if (confirmState.resolve) {
      // Puedes resolver en false o llamar a reject si lo prefieres.
      confirmState.resolve(false);
    }
    setConfirmState({
      isOpen: false,
      message: "",
      resolve: null,
      reject: null,
    });
  };

  // El componente ConfirmDialog para renderizar el modal de confirmación
  const ConfirmDialog = () => (
    <ConfirmModal
      isOpen={confirmState.isOpen}
      message={confirmState.message}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return [openConfirm, ConfirmDialog];
};
