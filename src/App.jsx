import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Catalog from "./Vistas/Catalogo.jsx";
import Cart from "./Vistas/Carrito.jsx";
import ProductosControl from "./Vistas/ProductosControl.jsx";
import { CartProvider } from "./Vistas/CarritoContex.jsx";
import { LanguageProvider } from "./Extras/LanguageContext.jsx";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Ordenes_Compras from "./Vistas/Ordenes.jsx";

const App = () => {
  const theme = createTheme({
    palette: {
      primary: { main: "#251863" },
      secondary: { main: "#4a148c" },
    },
    typography: { fontFamily: "Arial, sans-serif" },
  });

  return (
    <LanguageProvider>
      <CartProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div
            style={{
              backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/newbodycr.firebasestorage.app/o/logoim.png?alt=media&token=f9f79142-79a2-4097-a33b-3023e7ff2c72')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "contain",
              backgroundAttachment: "fixed",
              minHeight: "100vh",
              backgroundColor: "#fff",
            }}
          >
            <Router>
              <Routes>
                <Route path="/" element={<Catalog />} />
                <Route path="/catalogo" element={<Catalog />} />
                <Route path="/carrito" element={<Cart />} />
                <Route path="/productos" element={<ProductosControl />} />
                <Route path="/ordenes" element={<Ordenes_Compras />} />
              </Routes>
            </Router>
          </div>
        </ThemeProvider>
      </CartProvider>
    </LanguageProvider>
  );
};

export default App;
