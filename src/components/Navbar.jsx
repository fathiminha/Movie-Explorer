import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { mode, toggleMode, logout, user } = useApp();
  return (
    <AppBar position="sticky">
      <Toolbar sx={{ gap: 1, flexWrap: "wrap" }}>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: "inherit", textDecoration: "none" }}>
          Movie Explorer
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/favorites">Favorites</Button>
        <IconButton color="inherit" onClick={toggleMode} aria-label="Toggle light or dark mode">
          {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
        <Button color="inherit" onClick={logout}>Log out ({user})</Button>
      </Toolbar>
    </AppBar>
  );
}