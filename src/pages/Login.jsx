import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Box, Button, Paper, TextField, Typography, Alert } from "@mui/material";
import { useApp } from "../context/AppContext";

// Front-end only login ( any username + a password of 4+ characters.)
export default function Login() {
  const { user, login } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || password.length < 4) {
      setError("Enter a username and a password of at least 4 characters.");
      return;
    }
    login(username.trim());
    navigate("/");
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2 }}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: { xs: 3, sm: 4 }, width: "100%", maxWidth: 400, display: "grid", gap: 2 }}>
        <Typography variant="h5">Log in to Movie Explorer</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" variant="contained" size="large">Log in</Button>
      </Paper>
    </Box>
  );
}