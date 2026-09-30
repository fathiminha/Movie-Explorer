import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { getMovie, errorMessage, IMG } from "../api/tmdb";
import { useApp } from "../context/AppContext";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useApp();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setMovie(null);
    setError("");
    getMovie(id).then(setMovie).catch((e) => setError(errorMessage(e)));
  }, [id]);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!movie) return <Box sx={{ textAlign: "center" }}><CircularProgress /></Box>;

  const trailer = movie.videos?.results.find((v) => v.site === "YouTube" && v.type === "Trailer");
  const cast = movie.credits?.cast.slice(0, 8).map((c) => c.name).join(", ");
  const fav = isFavorite(movie.id);

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Button onClick={() => navigate(-1)} sx={{ alignSelf: "flex-start" }}>← Back</Button>
      <Box sx={{ display: "flex", gap: { xs: 2, md: 3 }, flexDirection: { xs: "column", md: "row" } }}>
        {movie.poster_path && (
          <Box
            component="img"
            src={IMG + movie.poster_path}
            alt={movie.title}
            sx={{
              width: { xs: "70%", sm: "50%", md: 300 },
              maxWidth: 300,
              borderRadius: 3,
              alignSelf: { xs: "center", md: "flex-start" },
              boxShadow: 4,
            }}
          />
        )}
        <Stack spacing={2} sx={{ minWidth: 0 }}>
          <Typography
            variant="h4"
            sx={{ fontSize: { xs: "1.6rem", sm: "2rem", md: "2.125rem" }, overflowWrap: "anywhere" }}
          >
            {movie.title} ({movie.release_date?.slice(0, 4) || "N/A"})
          </Typography>
          <Typography>
            ⭐ {movie.vote_average?.toFixed(1)} / 10 · {movie.runtime ? `${movie.runtime} min` : "Runtime unknown"}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {movie.genres.map((g) => <Chip key={g.id} label={g.name} size="small" />)}
          </Box>
          <Typography variant="h6">Overview</Typography>
          <Typography sx={{ overflowWrap: "anywhere" }}>{movie.overview || "No overview available."}</Typography>
          <Typography variant="h6">Cast</Typography>
          <Typography sx={{ overflowWrap: "anywhere" }}>{cast || "Cast information not available."}</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant={fav ? "outlined" : "contained"}
              startIcon={fav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={() => toggleFavorite(movie)}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {fav ? "Remove from favorites" : "Add to favorites"}
            </Button>
            {trailer && (
              <Button
                variant="outlined"
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noreferrer"
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                Watch trailer on YouTube
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
      {trailer && (
        <Box
          component="iframe"
          title="Trailer"
          src={`https://www.youtube.com/embed/${trailer.key}`}
          allowFullScreen
          sx={{ width: "100%", maxWidth: 800, aspectRatio: "16 / 9", border: 0, borderRadius: 2 }}
        />
      )}
    </Stack>
  );
}