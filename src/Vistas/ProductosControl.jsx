import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Container, Alert } from "reactstrap";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  deleteDoc
} from "firebase/firestore";
import { useModal } from "../Back/useModal";
import TopNavBar from "../Extras/navbar";
import ModalEditar from "../Extras/modal-editar";
import ModalCrear from "../Extras/modal-crear";
import ModalEliminar from "../Extras/modal-eliminar";
import "./tablas.css";

function ProductosControl() {
  const db = getFirestore();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [alertData, setAlertData] = useState({ show: false, text: "", type: "" });
  const [allProducts, setAllProducts] = useState([]);
  const [pageProducts, setPageProducts] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const perPage = 10;

  const [isOpenActualizar, openModalActualizar, closeModalActualizar] = useModal(false);
  const [isOpenCrear, openModalCrear, closeModalCrear] = useModal(false);
  const [isOpenEliminar, openModalEliminar, closeModalEliminar] = useModal(false);

  // Fetch all
  useEffect(() => {
    const fetchAll = async () => {
      const snap = await getDocs(collection(db, "Productos"));
      setAllProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchAll();
  }, [db]);

  // filter, sort, paginate
  useEffect(() => {
    let filtered = allProducts.filter(p =>
      p.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sortBy === "precio") filtered.sort((a, b) => a.precio - b.precio);
    if (sortBy === "descuento") filtered.sort((a, b) => a.descuento - b.descuento);
    const start = (currentPage - 1) * perPage;
    setPageProducts(filtered.slice(start, start + perPage));
  }, [allProducts, searchQuery, sortBy, currentPage]);

  const mostrarAlerta = (text, type) => {
    setAlertData({ show: true, text, type });
    setTimeout(() => setAlertData({ show: false, text: "", type: "" }), 1500);
  };

  // CRUD handlers (abrir modals)
  const abrirModalActualizar = p => { setProductoSeleccionado(p); setImageFile(null); openModalActualizar(); };
  const abrirModalEliminar = p => { setProductoSeleccionado(p); setImageFile(null); openModalEliminar(); };

  // Edit
  const editar = async form => {
    const q = query(collection(db, "Productos"), where("codigobarras", "==", productoSeleccionado.codigobarras));
    const snap = await getDocs(q);
    const idDoc = snap.docs[0]?.id;
    if (!idDoc) return;
    await updateDoc(doc(db, "Productos", idDoc), {
      nombre: form.nombre,
      precio: parseFloat(form.precio),
      descripcionEN: form.descripcionEN,
      descripcionES: form.descripcionES,
      descuento: parseFloat(form.descuento),
      imagen: imageFile || form.imagen
    });
    // refetch
    const snap2 = await getDocs(collection(db, "Productos"));
    setAllProducts(snap2.docs.map(d => ({ id: d.id, ...d.data() })));
    mostrarAlerta("Producto modificado con éxito", "success");
  };

  // Create
  const crearProducto = async form => {
    await addDoc(collection(db, "Productos"), {
      nombre: form.nombre,
      codigobarras: parseFloat(form.codigobarras),
      precio: parseFloat(form.precio),
      descuento: parseFloat(form.descuento),
      imagen: imageFile || form.imagen || "",
      descripcionEN: form.descripcionEN,
      descripcionES: form.descripcionES
    });
    const snap2 = await getDocs(collection(db, "Productos"));
    setAllProducts(snap2.docs.map(d => ({ id: d.id, ...d.data() })));
    mostrarAlerta("Producto creado con éxito", "success");
  };

  // Delete (soft)
  const eliminarProducto = async () => {
    await deleteDoc(doc(db, "Productos", productoSeleccionado.id));
    const snap2 = await getDocs(collection(db, "Productos"));
    setAllProducts(snap2.docs.map(d => ({ id: d.id, ...d.data() })));
    mostrarAlerta("Producto eliminado con éxito", "success");
  };

  return (
    <Container>
      <TopNavBar />
      <h1>Productos</h1>

      <Button color="success" onClick={openModalCrear}>Crear</Button>
      {alertData.show && <Alert color={alertData.type}>{alertData.text}</Alert>}

      <div className="d-flex my-3 gap-2">
        <input className="form-control" placeholder="Buscar por nombre" value={searchQuery}
          onChange={e => { setCurrentPage(1); setSearchQuery(e.target.value) }} />
        <select className="form-select w-auto"
          value={sortBy}
          onChange={e => { setCurrentPage(1); setSortBy(e.target.value) }}>
          <option value="">Ordenar</option>
          <option value="precio">Precio</option>
          <option value="descuento">Descuento</option>
        </select>
      </div>

      <Table className="table-custom" responsive>
        <thead>
          <tr>
            <th>Nombre</th><th>Precio</th><th>Descuento</th>
            <th>Imagen</th><th>Desc ES</th><th>Desc EN</th>
            <th>CB</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pageProducts.map(p => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.precio}</td>
              <td>{p.descuento}</td>
              <td><img src={p.imagen} alt="" width="40" height="40" /></td>
              <td className="descripcion">{p.descripcionES}</td>
              <td className="descripcion">{p.descripcionEN}</td>
              <td>{p.codigobarras}</td>
              <td>
                <Button size="sm" onClick={() => abrirModalActualizar(p)}>Editar</Button>{' '}
                <Button size="sm" onClick={() => abrirModalEliminar(p)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="my-3 d-flex align-items-center gap-2">
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)}>Anterior</Button>
        <span>Página {currentPage}</span>
        <Button disabled={pageProducts.length < perPage} onClick={() => setCurrentPage(c => c + 1)}>Siguiente</Button>
      </div>

      <ModalCrear
        isOpenA={isOpenCrear} closeModal={closeModalCrear}
        validateField={() => ({})}
        FuntionCreate={crearProducto}
        initialForm={{ nombre: '', codigobarras: '', precio: 0, descuento: 0, imagen: '', descripcionEN: '', descripcionES: '', ingredientesES: [], ingredientesEN: [] }}
        fieldOrder={{ 1: 'nombre', 2: 'codigobarras', 3: 'precio', 4: 'descuento', 5: 'imagen', 6: 'descripcionEN', 7: 'descripcionES',8: 'ingredientesES', 9: 'ingredientesEN' }}
        setImageFile={setImageFile}
      />

      <ModalEditar
        isOpenA={isOpenActualizar} closeModal={closeModalActualizar}
        elemento={productoSeleccionado}
        validateField={() => ({})}
        FuntionEdit={editar}
        fieldOrder={{ 1: 'nombre', 2: 'precio', 3: 'descuento', 4: 'imagen', 5: 'descripcionEN', 6: 'descripcionES', 7: 'ingredientesES', 8: 'ingredientesEN' }}
        nombreCrud="Producto" setImageFile={setImageFile}
      />

      <ModalEliminar
        isOpen={isOpenEliminar}            // coincide con la prop `isOpen`
        closeModal={closeModalEliminar}    // coincide con `closeModal`
        elemento={productoSeleccionado}    // datos del item
        nombreCrud="Producto"              // texto dinámico
        onDelete={eliminarProducto}        // coincide con `onDelete`
      />
    </Container>
  );
}

export default ProductosControl;
