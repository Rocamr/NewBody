import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Button
} from "reactstrap";
import { uploadImageToStorage } from "../Back/firebase";
import CustomAlert from "../Extras/alert";
import "./modal.css";

function ModalEditar({
  isOpenA,
  closeModal,
  elemento,
  validateField,
  FuntionEdit,
  fieldOrder,
  nombreCrud,
  combobox2,
  setImageFile
}) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [textoAlert, setTextoAlert] = useState("");
  const [tipoAlert, setTipoAlert] = useState("");

  useEffect(() => {
    // Cuando se abre el modal, se carga el elemento en el formulario
    if (isOpenA) {
      setForm(elemento || {});
    }
  }, [isOpenA, elemento]);

  const resetForm = () => {
    setForm({});
    setErrors({});
  };

  const handleChange = async (e) => {
    const { name } = e.target;
    if (name.toLowerCase() === "image" || name.toLowerCase() === "foto" || name.toLowerCase() === "imagen") {
      // Se sube la imagen y se actualiza el formulario
      try {
        const file = e.target.files[0];
        if (file) {
          const imageUrl = await uploadImageToStorage(file, "Imagenes" + nombreCrud);
          setImageFile(imageUrl);
          setTextoAlert("Imagen guardada");
          setTipoAlert("success");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 1000);
        }
      } catch (error) {
        setTextoAlert("Error al subir imagen");
        setTipoAlert("danger");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 1500);
      }
    } else {
      const { value } = e.target;
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
      setErrors(validateField(name, value));
    }
  };

  const cerrarModalActualizar = () => {
    resetForm();
    closeModal();
  };

  const editar = async () => {
    // Se podría validar antes de enviar, por ejemplo, comprobar que no existen errores.
    await FuntionEdit(form);
    resetForm();
    closeModal();
  };

  const generateFormGroups = () => {
    return Object.entries(fieldOrder).map(([order, key]) => {
      // Para campos numéricos (precio y descuento)
      if (key === "precio" || key === "descuento") {
        return (
          <FormGroup key={key} className={errors[key] ? "error" : ""}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <input
              required
              className="form-control"
              type="number"
              name={key}
              value={form[key] || ""}
              onChange={handleChange}
            />
            {errors[key] && <div className="error">{errors[key]}</div>}
          </FormGroup>
        );
      } else if (
        key.toLowerCase() === "image" ||
        key.toLowerCase() === "foto" ||
        key.toLowerCase() === "imagen"
      ) {
        return (
          <FormGroup key={key} className={errors[key] ? "error" : ""}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <input
              type="file"
              name={key}
              accept="image/*"
              onChange={handleChange}
            />
            {errors[key] && <div className="error">{errors[key]}</div>}
          </FormGroup>
        );
      } else {
        // Para el resto de los campos, se muestra un input de texto
        return (
          <FormGroup key={key} className={errors[key] ? "error" : ""}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <input
              required
              className="form-control"
              type="text"
              name={key}
              value={form[key] || ""}
              onChange={handleChange}
            />
            {errors[key] && <div className="error">{errors[key]}</div>}
          </FormGroup>
        );
      }
    });
  };

  return (
    <Modal isOpen={isOpenA} toggle={cerrarModalActualizar} backdrop="static">
      <ModalHeader>
        <div>
          <h3>Editar {nombreCrud}</h3>
        </div>
      </ModalHeader>

      <ModalBody>
        {showAlert && <CustomAlert isOpen={showAlert} texto={textoAlert} tipo={tipoAlert} />}
        {generateFormGroups()}
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={editar}>
          Editar
        </Button>
        <Button color="danger" onClick={cerrarModalActualizar}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalEditar;
