// Ordenes_Compras.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Container
} from "reactstrap";
import { format } from "date-fns";
import TopNavBar from "../Extras/navbar";
import { useModal } from "../Back/useModal";
import ModalDetalles from "../Extras/modalDetalles";
import ModalEliminar from "../Extras/modal-eliminar";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc
} from "firebase/firestore";
import "./tablas.css";

function Ordenes_Compras() {
  const db = getFirestore();
  const [pedidos, setPedidos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchDate, setSearchDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const [isOpenDetalles, openDetalles, closeDetalles] = useModal(false);
  const [isOpenEliminar, openEliminar, closeEliminar] = useModal(false);

  useEffect(() => {
    fetchPedidos(1);
  }, [searchDate]);

  const fetchPedidos = async (page) => {
  const colRef = collection(db, "Ordenes");
  const q = query(colRef, orderBy("fecha", "desc"));
  const snap = await getDocs(q);

  let all = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Filtrado por fecha
  if (searchDate) {
    const selectedDate = new Date(searchDate).toDateString();
    all = all.filter(o =>
      o.fecha?.toDate().toDateString() === selectedDate
    );
  }

  // Filtrado por nombre
  if (searchQuery.trim()) {
    const queryLower = searchQuery.toLowerCase();
    all = all.filter(o =>
      o.buyer?.name?.toLowerCase().includes(queryLower)
    );
  }

  const perPage = 10;
  const start = (page - 1) * perPage;
  const end = start + perPage;

  setPedidos(all.slice(start, end));
  setCurrentPage(page);
};


  const formatFecha = ts =>
    ts?.toDate ? format(ts.toDate(), "dd/MM/yyyy") : "";

  const abrirDetalles = (p) => {
    setPedidoSeleccionado(p);
    openDetalles();
  };

  const abrirEliminar = (p) => {
    setPedidoSeleccionado(p);
    openEliminar();
  };

  const eliminarPedido = async () => {
    if (!pedidoSeleccionado) return;
    await deleteDoc(doc(db, "Ordenes", pedidoSeleccionado.id));
    closeEliminar();
    fetchPedidos(currentPage);
  };

  return (
    <div className="ordenes-compras-container">
      <TopNavBar />
      <Container>
        <h2>Órdenes de Compra</h2>

        <div className="d-flex gap-2 mb-3">
          <input
            type="date"
            onChange={e => setSearchDate(e.target.value)}
            className="form-control w-auto"
          />
          <input
            type="text"
            placeholder="Buscar por comprador"
            onChange={e => setSearchQuery(e.target.value)}
            className="form-control w-auto"
          />
        </div>

        <Table striped>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Comprador</th>
              <th>Telefono</th>
              <th>Correo</th>
              <th>Dirección</th>
              <th>Método Pago</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos
              .filter(o =>
                o.buyer?.name?.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(p => (
                <tr key={p.id}>
                  <td>{formatFecha(p.fecha)}</td>
                  <td>{p.buyer?.name || "-"}</td>
                  <td>{p.buyer?.phone || "-"}</td>
                  <td>{p.buyer?.email || "-"}</td>
                  <td>{p.buyer?.address || "-"}</td>
                  <td>{p.buyer?.paymentMethod || "-"}</td>
                  <td>${p.total.toFixed(2)}</td>
                  <td>
                    <Button color="info" size="sm" onClick={() => abrirDetalles(p)}>
                      Ver
                    </Button>{" "}
                    <Button color="danger" size="sm" onClick={() => abrirEliminar(p)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </Table>

        <div className="d-flex justify-content-between">
          <Button
            disabled={currentPage === 1}
            onClick={() => {
              const prev = currentPage - 1;
              setCurrentPage(prev);
              fetchPedidos(prev);
            }}
          >
            Anterior
          </Button>
          <Button
            onClick={() => {
              const next = currentPage + 1;
              setCurrentPage(next);
              fetchPedidos(next);
            }}
          >
            Siguiente
          </Button>
        </div>
      </Container>

      <ModalDetalles
        isOpen={isOpenDetalles}
        closeModal={closeDetalles}
        elemento={pedidoSeleccionado}
      />

      <ModalEliminar
        isOpen={isOpenEliminar}
        closeModal={closeEliminar}
        FuntionDelete={eliminarPedido}
        nombreCrud="Orden de compra"
      />
    </div>
  );
}

export default Ordenes_Compras;
