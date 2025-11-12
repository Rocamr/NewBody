// Catalog.jsx
import React, { useContext, useState, useEffect } from "react";
import ProductCard from "./Producto";
import { CartContext } from "./CarritoContex";
import { LanguageContext } from "../Extras/LanguageContext";
import { db } from "../Back/firebase";
import TopNavBar from "../Extras/navbar";
import ModalDetalles from "../Extras/modalDetalles"; // <-- tu modal
import { collection, getDocs } from "firebase/firestore";
import CustomAlert from "../Extras/alert";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Footer from "../Extras/piedePagina";

export default function Catalog() {
  const { addToCart } = useContext(CartContext);
  const { language } = useContext(LanguageContext);

  const [productos, setProductos] = useState([]);
  const [alert, setAlert] = useState({ show: false, text: "", type: "" });
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);
  const [loading, setLoading] = useState(true);

  // estados para el modal de detalles
  const [isOpenDetalles, setIsOpenDetalles] = useState(false);
  const [elementoDetalle, setElementoDetalle] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const snap = await getDocs(collection(db, "Productos"));
      setProductos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    })();
  }, []);

  const handleAddToCart = (p) => {
    addToCart(p);
    setAlert({
      show: true,
      text: language === "en"
        ? `${p.nombre} added to cart!`
        : `${p.nombre} agregado al carrito!`,
      type: "success"
    });
    setTimeout(() => setAlert({ show: false, text: "", type: "" }), 2000);
  };

  const handleView = (p) => {
    setElementoDetalle(p);
    setIsOpenDetalles(true);
  };

  const closeDetalles = () => {
    setIsOpenDetalles(false);
    setElementoDetalle(null);
  };

  // Filtrado y orden
  let shown = productos.filter(p => p.nombre.toLowerCase().includes(filter.toLowerCase()));
  if (sort) {
    const rev = sort.startsWith("-");
    const key = rev ? sort.slice(1) : sort;
    shown = shown.sort((a,b) => rev ? b[key] - a[key] : a[key] - b[key]);
  }

  return (
    <Container className="catalog-container py-4">
      <TopNavBar />
      <h2 className="mb-4 text-success">
        {language==='en' ? 'Product Catalog' : 'Catálogo de Productos'}
      </h2>

      {alert.show && (
        <CustomAlert isOpen={alert.show} texto={alert.text} tipo={alert.type} />
      )}

      {/* filtros */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <Form.Control
          placeholder={language==='en'?'Search…':'Buscar…'}
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ maxWidth: 200 }}
        />
        <Form.Select
          value={sort}
          onChange={e => setSort(e.target.value)}
          style={{ maxWidth: 200 }}
        >
          <option value="">{language==='en'?'Sort by…':'Ordenar…'}</option>
          <option value="precio">{language==='en'?'Price ↑':'Precio ↑'}</option>
          <option value="-precio">{language==='en'?'Price ↓':'Precio ↓'}</option>
          <option value="descuento">{language==='en'?'Discount ↑':'Descuento ↑'}</option>
          <option value="-descuento">{language==='en'?'Discount ↓':'Descuento ↓'}</option>
        </Form.Select>
      </div>

      {/* grid */}
      <Row className="g-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) =>
              <Col key={i}><div className="skeleton-card"></div></Col>
            )
          : shown.slice(0, visibleCount).map(p =>
              <Col md={6} lg={4} key={p.id}>
                <ProductCard
                  product={p}
                  onAddToCart={handleAddToCart}
                  onView={handleView}
                />
              </Col>
            )
        }
      </Row>

      {/* load more */}
      {!loading && visibleCount < shown.length && (
        <div className="text-center my-4">
          <Button onClick={() => setVisibleCount(c => c + 20)}>
            {language==='en'?'Load more':'Ver más'}
          </Button>
        </div>
      )}

      {/* ModalDetalles */}
      <ModalDetalles
        isOpen={isOpenDetalles}
        closeModal={closeDetalles}
        elemento={elementoDetalle}
      />
      <Footer/>
    </Container> 
  );
}
