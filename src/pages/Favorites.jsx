import { Typography, Stack } from "@mui/material";
import MovieGrid from "../components/MovieGrid";
import { useApp } from "../context/AppContext";

export default function Favorites() {
  const { favorites } = useApp();
  return (
    <Stack spacing={3}>
      <Typography variant="h5" sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>Your favorites</Typography>
      {favorites.length === 0 ? (
        <Typography>No favorites yet. Tap the heart on any movie to save it here.</Typography>
      ) : (
        <MovieGrid movies={favorites} />
      )}
    </Stack>
  );
}