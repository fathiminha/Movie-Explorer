import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Container } from "@mui/material";
import { useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Favorites from "./pages/Favorites";

// Wraps all pages that need a logged in user.
function ProtectedLayout() {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <>
      <Navbar />
      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 2, sm: 3 },
          px: { xs: 1.5, sm: 3 },
        }}
      >
        <Outlet />
      </Container>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/favorites" element={<Favorites />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}