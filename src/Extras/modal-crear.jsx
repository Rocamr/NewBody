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
  const [mensajeError, setMensajeError] = useState("");

  // ================= VALIDACIONES =================
  const esValorNegativo = (valor) => Number(valor) < 0;

  const contienePayloadPeligroso = (texto) => {
    if (!texto) return false;

    const patrones = [
      /<script.*?>/i,
      /<\/script>/i,
      /onerror\s*=/i,
      /onload\s*=/i,
      /javascript:/i,
      /<.*?>/i
    ];

    return patrones.some((rgx) => rgx.test(texto));
  };

  // ================= INGREDIENTES =================
  const addIngredient = () => {
    setForm(f => ({ ...f, ingredientes: [...(f.ingredientes || []), ""] }));
  };

  const removeIngredient = i => {
    setForm(f => ({
      ...f,
      ingredientes: f.ingredientes.filter((_, idx) => idx !== i)
    }));
  };

  const handleIngredientChange = (i, value) => {
    setForm(f => {
      const ing = [...(f.ingredientes || [])];
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
    setMensajeError("");
  };

  // ================= HANDLE CHANGE =================
  const handleChange = async (e) => {
    const { name, type, value, files } = e.target;

    if (type === "file" && ["image", "foto", "imagen"].includes(name.toLowerCase())) {
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

    if (["precio", "codigobarras", "descuento"].includes(name)) {
      if (esValorNegativo(value)) {
        setErrors(prev => ({ ...prev, [name]: "No se permiten valores negativos." }));
        setForm(prev => ({ ...prev, [name]: "" }));
        return;
      }
    }

    if (["descripcionES", "descripcionEN"].includes(name)) {
      if (contienePayloadPeligroso(value)) {
        setErrors(prev => ({ ...prev, [name]: "Contenido inválido detectado." }));
        return;
      }
    }

    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // ================= CREAR (VALIDACIÓN REAL) =================
  const crear = async () => {
    setMensajeError("");

    const camposRequeridos = ["nombre", "precio", "codigobarras", "descripcionES", "descripcionEN"];

    // Revisar errores actuales
    const hayErrores = Object.values(errors).some(e => e && e !== "");
    if (hayErrores) {
      setMensajeError("El producto no se creó porque hay errores en el formulario.");
      return;
    }

    // Revisar campos requeridos vacíos
    for (const campo of camposRequeridos) {
      if (!form[campo] || form[campo].toString().trim() === "") {
        setErrors(prev => ({ ...prev, [campo]: "Este campo es obligatorio." }));
        setMensajeError("El producto no se creó porque faltan campos obligatorios.");
        return;
      }
    }

    // Validación numérica
    if (Number(form.precio) < 0 || Number(form.codigobarras) < 0) {
      setMensajeError("El producto no se creó porque los valores numéricos no son válidos.");
      return;
    }

    // Si pasa todas las validaciones, entonces sí se crea
    await FuntionCreate(form);
    cerrarModalCrear();
  };

  const cerrarModalCrear = () => {
    resetForm();
    closeModal();
  };

  // ================= RENDER =================
  return (
    <Modal isOpen={isOpenA} toggle={cerrarModalCrear} backdrop="static">
      <ModalHeader toggle={cerrarModalCrear}>
        <h3>Crear Producto / Orden</h3>
      </ModalHeader>

      <ModalBody>

        {mensajeError && (
          <div className="alert alert-danger text-center">{mensajeError}</div>
        )}

        {Object.entries(fieldOrder).map(([_, key]) => (
          <FormGroup key={key} className={errors[key] ? "error" : ""}>
            <label>{key}</label>

            {key.toLowerCase().includes("imagen") ? (
              <input type="file" name={key} accept="image/*" onChange={handleChange}/>
            ) : ["precio", "descuento"].includes(key) ? (
              <input
                type="number"
                name={key}
                value={form[key] || ""}
                onChange={handleChange}
                className="form-control"
              />
            ) : (
              <input
                type="text"
                name={key}
                value={form[key] || ""}
                onChange={handleChange}
                className="form-control"
              />
            )}

            {errors[key] && <div className="error">{errors[key]}</div>}
          </FormGroup>
        ))}

        {/* Ingredientes dinámicos */}
        <FormGroup>
          <label>Ingredientes:</label>
          {(form.ingredientes || []).map((ing, i) => (
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
        <Button
          color="primary"
          onClick={crear}
        >
          Crear
        </Button>

        <Button color="secondary" onClick={cerrarModalCrear}>
          Cancelar
        </Button>
      </ModalFooter>

    </Modal>
  );
}

export default ModalCrear;
