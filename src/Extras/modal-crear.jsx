import React, { useEffect, useState } from "react";
import "./modal.css";
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Button
} from "reactstrap";
import { uploadImageToStorage } from "../Back/firebase";

function ModalCrear({
  isOpenA,
  closeModal,
  validateField,
  FuntionCreate,
  initialForm,
  fieldOrder,
  setImageFile
}) {

  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(initialForm);

  // ================= VALIDACIONES =================
  const esValorNegativo = (valor) => {
    return Number(valor) < 0;
  };

  const contienePayloadPeligroso = (texto) => {
    if (!texto) return false;

    const patrones = [
      /<script.*?>/i,
      /<\/script>/i,
      /onerror\s*=/i,
      /onload\s*=/i,
      /javascript:/i,
      /<.*?>/i // cualquier tag HTML
    ];

    return patrones.some((rgx) => rgx.test(texto));
  };

  // ================= INGREDIENTES =================
  const addIngredient = () => {
    setForm(f => ({ ...f, ingredientes: [...(f.ingredientes||[]), ""] }));
  };

  const removeIngredient = i => {
    setForm(f => ({
      ...f,
      ingredientes: f.ingredientes.filter((_, idx) => idx !== i)
    }));
  };

  const handleIngredientChange = (i, value) => {
    setForm(f => {
      const ing = [...(f.ingredientes||[])];
      ing[i] = value;
      return { ...f, ingredientes: ing };
    });
  };

  // ================= EFFECT =================
  useEffect(() => {
    if (!isOpenA) resetForm();
  }, [isOpenA]);

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
  };

  // ================= HANDLE CHANGE =================
  const handleChange = async (e) => {
    const { name, type, value, files } = e.target;

    // === ARCHIVO / IMAGEN ===
    if (type === "file" && ["image","foto","imagen"].includes(name.toLowerCase())) {
      try {
        const file = files[0];
        if (file) {
          const imageUrl = await uploadImageToStorage(file, "ImagenesProductos");
          setImageFile(imageUrl);
          setForm(prev => ({ ...prev, [name]: imageUrl }));
        }
      } catch (error) {
        console.error(error);
      }
      return;
    }

    // === NÚMEROS NEGATIVOS ===
    if (["precio", "codigobarras", "descuento"].includes(name)) {
      if (esValorNegativo(value)) {
        setErrors(prev => ({ ...prev, [name]: "No se permiten valores negativos." }));
        setForm(prev => ({ ...prev, [name]: "" }));
        return;
      }
    }

    // === XSS / PAYLOADS ===
    if (["descripcionES", "descripcionEN"].includes(name)) {
      if (contienePayloadPeligroso(value)) {
        setErrors(prev => ({ ...prev, [name]: "Contenido inválido detectado." }));
        return;
      }
    }

    // === VALIDACIÓN NORMAL ===
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // ================= CREAR =================
  const cerrarModalCrear = () => {
    resetForm();
    closeModal();
  };

  const crear = async () => {
    await FuntionCreate(form);
    cerrarModalCrear();
  };

  // ================= RENDER =================
  return (
    <Modal isOpen={isOpenA} toggle={cerrarModalCrear} backdrop="static">
      <ModalHeader toggle={cerrarModalCrear}>
        <h3>Crear Producto / Orden</h3>
      </ModalHeader>
      <ModalBody>

        {Object.entries(fieldOrder).map(([_, key]) => (
          <FormGroup key={key} className={errors[key] ? "error" : ""}>
            <label>{key}</label>

            {key.toLowerCase().includes("imagen") ? (
              <input type="file" name={key} accept="image/*" onChange={handleChange}/>
            ) : ["precio","descuento"].includes(key) ? (
              <input type="number" name={key} value={form[key]||""}
                     onChange={handleChange} className="form-control"/>
            ) : (
              <input type="text" name={key} value={form[key]||""}
                     onChange={handleChange} className="form-control"/>
            )}

            {errors[key] && <div className="error">{errors[key]}</div>}
          </FormGroup>
        ))}

        {/* Ingredientes dinámicos */}
        <FormGroup>
          <label>Ingredientes:</label>
          {(form.ingredientes||[]).map((ing, i) => (
            <div key={i} className="d-flex mb-2">
              <input
                type="text"
                className="form-control"
                value={ing}
                onChange={e => handleIngredientChange(i, e.target.value)}
                placeholder={`Ingrediente #${i+1}`}
              />
              <Button color="danger" size="sm" className="ms-2" onClick={() => removeIngredient(i)}>
                &times;
              </Button>
            </div>
          ))}
          <Button color="primary" size="sm" onClick={addIngredient}>
            + Añadir ingrediente
          </Button>
        </FormGroup>
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={crear}>Crear</Button>
        <Button color="secondary" onClick={cerrarModalCrear}>Cancelar</Button>
      </ModalFooter>

    </Modal>
  );
}

export default ModalCrear;
