import { Typography, Stack, Box, alpha, useTheme } from "@mui/material";
import MovieGrid from "../components/MovieGrid";
import { useApp } from "../context/AppContext";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import MovieFilterRoundedIcon from "@mui/icons-material/MovieFilterRounded";

export default function Favorites() {
  const { favorites } = useApp();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accent = isDark ? "#a78bfa" : "#6c63ff";

  return (
    <Stack spacing={3} sx={{ animation: "fadeInUp 0.5s ease both" }}>
      {/* Section heading */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 0.3 }}>
          <FavoriteRoundedIcon sx={{ color: "#ff4d6d", fontSize: 26 }} />
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1.3rem", sm: "1.55rem" },
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Your Favorites
          </Typography>
          {favorites.length > 0 && (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 28,
                height: 28,
                borderRadius: "10px",
                bgcolor: alpha("#ff4d6d", 0.1),
                border: `1px solid ${alpha("#ff4d6d", 0.2)}`,
                px: 0.8,
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "#ff4d6d",
                }}
              >
                {favorites.length}
              </Typography>
            </Box>
          )}
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: "0.85rem",
            pl: 4.7,
            mt: -0.3,
          }}
        >
          {favorites.length > 0
            ? "Movies you've saved for later"
            : "Start building your collection"}
        </Typography>
      </Box>

      {favorites.length === 0 ? (
        <Box
          sx={{
            animation: "scaleIn 0.4s ease both",
            textAlign: "center",
            py: { xs: 6, sm: 10 },
          }}
        >
          {/* Empty state illustration */}
          <Box
            sx={{
              position: "relative",
              display: "inline-flex",
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: alpha(accent, 0.06),
                border: `1px solid ${alpha(accent, 0.1)}`,
              }}
            >
              <MovieFilterRoundedIcon
                sx={{ fontSize: 48, color: accent, opacity: 0.5 }}
              />
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: -4,
                right: -4,
                width: 36,
                height: 36,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: alpha("#ff4d6d", 0.1),
                border: `2px solid ${isDark ? "#07080d" : "#f4f6fb"}`,
              }}
            >
              <FavoriteBorderRoundedIcon
                sx={{ fontSize: 18, color: "#ff4d6d", opacity: 0.7 }}
              />
            </Box>
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontSize: "1.15rem",
            }}
          >
            No favorites yet
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              maxWidth: 320,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Tap the <FavoriteBorderRoundedIcon sx={{ fontSize: 16, verticalAlign: "middle", mx: 0.3 }} /> heart
            on any movie to save it here for easy access later.
          </Typography>
        </Box>
      ) : (
        <MovieGrid movies={favorites} />
      )}
    </Stack>
  );
}