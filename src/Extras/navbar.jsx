import React, { useState, useContext } from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Drawer,
  List, ListItem, ListItemText, useMediaQuery, Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { LanguageContext } from "../Extras/LanguageContext";
import Logo from "../Vistas/logoim.png";
import { translations } from './extras';
import "./navbar.css";

export default function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { language, toggleLanguage } = useContext(LanguageContext);
  const texto = translations[language]
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setDrawerOpen(open);
  };

  return (
    <AppBar className="app-bar" position="static">
      <Toolbar className="toolbar">
        {isMobile ? (
          <>
            <IconButton edge="start" onClick={toggleDrawer(true)} className="mobile-logo-button">
              <img src={Logo} alt="Logo" className="navbar-logo" />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              PaperProps={{ className: 'drawer-paper' }}
            >
              <List>
                <ListItem button component={Link} to="/catalogo" onClick={toggleDrawer(false)}>
                  <ListItemText primary={texto.navbar.catalog} />
                </ListItem>
                <ListItem button component={Link} to="/carrito" onClick={toggleDrawer(false)}>
                  <ListItemText primary={texto.navbar.cart} />
                </ListItem>
              </List>
            </Drawer>
          </>
        ) : (
          <>
            <Box display="flex" alignItems="center" sx={{ gap: '10px' }}>
              <img src={Logo} alt="Logo" className="navbar-logo" />
              <Typography className="navbar-title" variant="h6" component={Link} to="/catalogo">
                New Body CR
              </Typography>
            </Box>
            <div className="button-container">
              <Button color="inherit" component={Link} to="/catalogo">
                {texto.navbar.catalog}
              </Button>
              <Button color="inherit" component={Link} to="/carrito">
                {texto.navbar.cart}
              </Button>
            </div>
          </>
        )}

        <Button color="inherit" onClick={toggleLanguage} className="language-button">
          {language === 'en' ? "ES" : "EN"}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
