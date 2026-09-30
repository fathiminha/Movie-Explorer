import { Link } from "react-router-dom";
import { Card, CardActionArea, CardMedia, CardContent, Typography, IconButton, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { IMG } from "../api/tmdb";
import { useApp } from "../context/AppContext";

export default function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite(movie.id);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
  const poster = movie.poster_path ? IMG + movie.poster_path : "https://placehold.co/500x750?text=No+Poster";

  return (
    <Card sx={{ height: "100%", position: "relative" }}>
      <IconButton
        onClick={() => toggleFavorite(movie)}
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        sx={{ position: "absolute", top: 4, right: 4, zIndex: 1, bgcolor: "background.paper", "&:hover": { bgcolor: "background.paper" } }}
      >
        {fav ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
      </IconButton>
      <CardActionArea component={Link} to={`/movie/${movie.id}`}>
        <CardMedia component="img" image={poster} alt={movie.title} sx={{ aspectRatio: "2 / 3" }} />
        <CardContent>
          <Typography variant="subtitle1" noWrap title={movie.title}>{movie.title}</Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">{year}</Typography>
            <Typography variant="body2" color="text.secondary">⭐ {movie.vote_average?.toFixed(1)}</Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}