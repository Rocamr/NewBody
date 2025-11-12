import React, { useContext } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaInfoCircle } from 'react-icons/fa';
import { LanguageContext } from '../Extras/LanguageContext';
import './producto.css';

const ProductCard = ({ product, onAddToCart, onView }) => {
  const { language } = useContext(LanguageContext);
  const discountedPrice = product.precio * (1 - product.descuento / 100);

  return (
    <Card className="product-card h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={product.imagen}
        alt={product.nombre}
        loading="lazy"
        className="card-img-top"
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="d-flex justify-content-between align-items-center mb-3">
          <span className="product-name">{product.nombre}</span>
          <Badge bg="secondary">${discountedPrice.toFixed(2)}</Badge>
        </Card.Title>

        <div className="mt-auto d-flex justify-content-between">
          {/* Botón Ver Info ahora solo icono */}
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onView(product)}
            aria-label={language === 'en' ? 'View Info' : 'Ver Info'}
          >
            <FaInfoCircle />
          </Button>

          {/* Botón Agregar al carrito */}
          <Button
            variant="success"
            size="sm"
            onClick={() => onAddToCart(product)}
            aria-label={language === 'en' ? 'Add to Cart' : 'Agregar al carrito'}
          >
            <FaShoppingCart />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
