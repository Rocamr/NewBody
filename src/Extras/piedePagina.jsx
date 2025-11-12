// src/components/Extras/Footer.jsx
import React from 'react';
import './piepagina.css';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <p>Síguenos en redes sociales:</p>
      <div className="social-icons">
        <a href="https://www.facebook.com/newbodycostarica" target="_blank" rel="noopener noreferrer">
          <FaFacebook />
        </a>
        <a href="https://www.instagram.com/newbodycostarica" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
        <a href="https://wa.me/50687497875" target="_blank" rel="noopener noreferrer">
          <FaWhatsapp />
        </a>
      </div>
      <p>© {new Date().getFullYear()} New Body CR. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;
