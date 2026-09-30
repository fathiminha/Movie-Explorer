import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Button, IconButton, Box,
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { mode, toggleMode, logout, user } = useApp();
  const [open, setOpen] = useState(false); // mobile menu open/closed
  const close = () => setOpen(false);

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ gap: 1 }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          noWrap
          sx={{ flexGrow: 1, color: "inherit", textDecoration: "none", fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
        >
          Movie Explorer
        </Typography>

        {/* Desktop / tablet links */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 }}>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/favorites">Favorites</Button>
          <IconButton color="inherit" onClick={toggleMode} aria-label="Toggle light or dark mode">
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          <Button color="inherit" onClick={logout}>Log out ({user})</Button>
        </Box>

        {/* Hamburger (phones only) */}
        <IconButton
          color="inherit"
          edge="end"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          sx={{ display: { xs: "flex", sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Slide-in mobile menu */}
      <Drawer anchor="right" open={open} onClose={close}>
        <Box sx={{ width: 260 }} role="presentation">
          <Typography sx={{ p: 2 }} variant="subtitle1" noWrap>Hi, {user}</Typography>
          <Divider />
          <List>
            <ListItemButton component={Link} to="/" onClick={close}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
            <ListItemButton component={Link} to="/favorites" onClick={close}>
              <ListItemIcon><FavoriteIcon /></ListItemIcon>
              <ListItemText primary="Favorites" />
            </ListItemButton>
            <ListItemButton onClick={() => { toggleMode(); close(); }}>
              <ListItemIcon>{mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}</ListItemIcon>
              <ListItemText primary={mode === "light" ? "Dark mode" : "Light mode"} />
            </ListItemButton>
            <Divider />
            <ListItemButton onClick={() => { close(); logout(); }}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Log out" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}