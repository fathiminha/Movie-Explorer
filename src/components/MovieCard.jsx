import { Link } from "react-router-dom";
import { Card, CardActionArea, Typography, IconButton, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { IMG } from "../api/tmdb";
import { useApp } from "../context/AppContext";

export default function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite(movie.id);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
  const poster = movie.poster_path ? IMG + movie.poster_path : "https://placehold.co/500x750?text=No+Poster";

  return (
    <Card
      elevation={0}
      sx={{
        position: "relative",
        aspectRatio: "2 / 3",
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "grey.900",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        // Hover effects only on devices that have a real hover
        "@media (hover: hover)": {
          "& .details-btn": { opacity: 0, transform: "translateY(8px)" },
          "&:hover": { transform: "translateY(-6px)", boxShadow: "0 16px 32px rgba(0,0,0,0.4)" },
          "&:hover .poster": { transform: "scale(1.08)" },
          "&:hover .details-btn": { opacity: 1, transform: "translateY(0)" },
        },
        // Also show the button when a keyboard user tabs onto the card.
        "&:focus-within .details-btn": { opacity: 1, transform: "translateY(0)" },
      }}
    >
      {/* Glass-style favorite button */}
      <IconButton
        onClick={() => toggleFavorite(movie)}
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        size="small"
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 2,
          color: "#fff",
          bgcolor: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.3)",
          transition: "all 0.25s ease",
          "&:hover": { bgcolor: "rgba(255,255,255,0.32)", transform: "scale(1.1)" },
        }}
      >
        {fav ? <FavoriteIcon sx={{ color: "#ff4d6d" }} /> : <FavoriteBorderIcon />}
      </IconButton>

      {/* The whole card is the link to the details page */}
      <CardActionArea
        component={Link}
        to={`/movie/${movie.id}`}
        aria-label={`View details for ${movie.title}`}
        sx={{ position: "absolute", inset: 0 }}
      >
        <Box
          component="img"
          className="poster"
          src={poster}
          alt={movie.title}
          loading="lazy"
          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease" }}
        />

        {/* Gradient overlay with the movie info */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            p: { xs: 1.5, sm: 2 },
            pt: 8,
            color: "#fff",
            background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0) 100%)",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              lineHeight: 1.25,
              fontSize: { xs: "0.9rem", sm: "1rem" },
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {movie.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 0.5 }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>{year}</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
              <StarRoundedIcon sx={{ fontSize: 18, color: "#ffc107" }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{movie.vote_average?.toFixed(1)}</Typography>
            </Box>
          </Box>

          {/* "Button" is a styled box because the whole card is already a link */}
          <Box
            className="details-btn"
            sx={{
              display: "inline-block",
              mt: 1.5,
              px: 2,
              py: 0.6,
              borderRadius: 99,
              bgcolor: "primary.main",
              fontSize: 13,
              fontWeight: 600,
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            View Details
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}