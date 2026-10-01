import { Link } from "react-router-dom";
import { Card, CardActionArea, Typography, IconButton, Box, alpha, useTheme } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { IMG } from "../api/tmdb";
import { useApp } from "../context/AppContext";

export default function MovieCard({ movie, index = 0 }) {
  const { isFavorite, toggleFavorite } = useApp();
  const theme = useTheme();
  const fav = isFavorite(movie.id);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
  const poster = movie.poster_path ? IMG + movie.poster_path : "https://placehold.co/500x750?text=No+Poster";
  const isDark = theme.palette.mode === "dark";
  const rating = movie.vote_average?.toFixed(1);
  const ratingColor =
    movie.vote_average >= 7 ? "#4ade80" : movie.vote_average >= 5 ? "#fbbf24" : "#f87171";

  return (
    <Card
      elevation={0}
      sx={{
        position: "relative",
        aspectRatio: "2 / 3",
        borderRadius: "16px",
        overflow: "hidden",
        bgcolor: isDark ? "grey.900" : "grey.200",
        border: `1px solid ${alpha(isDark ? "#ffffff" : "#000000", 0.06)}`,
        boxShadow: isDark
          ? "0 4px 20px rgba(0,0,0,0.4)"
          : "0 4px 20px rgba(0,0,0,0.08)",
        transition: "transform 0.4s cubic-bezier(.4,0,.2,1), box-shadow 0.4s cubic-bezier(.4,0,.2,1)",
        animation: "fadeInUp 0.5s ease both",
        animationDelay: `${Math.min(index * 0.05, 0.6)}s`,
        "@media (hover: hover)": {
          "& .details-btn": { opacity: 0, transform: "translateY(8px)" },
          "&:hover": {
            transform: "translateY(-8px) scale(1.02)",
            boxShadow: isDark
              ? "0 20px 40px rgba(0,0,0,0.5), 0 0 40px rgba(167,139,250,0.08)"
              : "0 20px 40px rgba(0,0,0,0.12)",
          },
          "&:hover .poster": { transform: "scale(1.08)" },
          "&:hover .details-btn": { opacity: 1, transform: "translateY(0)" },
          "&:hover .overlay": { opacity: 1 },
        },
        "&:focus-within .details-btn": { opacity: 1, transform: "translateY(0)" },
      }}
    >
      {/* Rating badge */}
      <Box
        sx={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          gap: 0.4,
          px: 1,
          py: 0.35,
          borderRadius: "8px",
          bgcolor: alpha("#000000", 0.65),
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: `1px solid ${alpha("#ffffff", 0.1)}`,
        }}
      >
        <StarRoundedIcon sx={{ fontSize: 14, color: "#ffc107" }} />
        <Typography
          sx={{
            fontSize: "0.72rem",
            fontWeight: 700,
            color: ratingColor,
            lineHeight: 1,
          }}
        >
          {rating}
        </Typography>
      </Box>

      {/* Glass style favorite button */}
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
          width: 34,
          height: 34,
          bgcolor: alpha("#ffffff", 0.12),
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: `1px solid ${alpha("#ffffff", 0.2)}`,
          transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
          "&:hover": {
            bgcolor: alpha("#ffffff", 0.25),
            transform: "scale(1.15)",
          },
        }}
      >
        {fav ? (
          <FavoriteIcon sx={{ fontSize: 18, color: "#ff4d6d" }} />
        ) : (
          <FavoriteBorderIcon sx={{ fontSize: 18 }} />
        )}
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
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.6s cubic-bezier(.4,0,.2,1)",
          }}
        />

        {/* Gradient overlay with the movie info */}
        <Box
          className="overlay"
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            p: { xs: 1.5, sm: 2 },
            pt: 10,
            color: "#fff",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 100%)",
            transition: "opacity 0.3s ease",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              lineHeight: 1.25,
              fontSize: { xs: "0.88rem", sm: "0.95rem" },
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              letterSpacing: "-0.01em",
            }}
          >
            {movie.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <Typography
              variant="body2"
              sx={{ opacity: 0.7, fontSize: "0.78rem", fontWeight: 500 }}
            >
              {year}
            </Typography>
          </Box>

          <Box
            className="details-btn"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              mt: 1.5,
              px: 2,
              py: 0.6,
              borderRadius: "10px",
              bgcolor: "primary.main",
              fontSize: "0.78rem",
              fontWeight: 600,
              letterSpacing: "0.02em",
              transition: "opacity 0.3s ease, transform 0.3s ease",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            View Details
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}