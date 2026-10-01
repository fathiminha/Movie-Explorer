import { useEffect, useRef, useState } from "react";
import {
  Typography, Alert, Box, Stack, Button, Skeleton, alpha, useTheme, Grid,
} from "@mui/material";
import SearchBar from "../components/SearchBar";
import MovieGrid from "../components/MovieGrid";
import { getTrending, searchMovies, errorMessage } from "../api/tmdb";
import { useApp } from "../context/AppContext";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import MovieFilterRoundedIcon from "@mui/icons-material/MovieFilterRounded";
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";

/* Skeleton grid shown while loading the first page */
function MovieSkeletonGrid() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <Grid item xs={6} sm={4} md={3} lg={2} key={i}>
          <Skeleton
            variant="rounded"
            sx={{
              width: "100%",
              aspectRatio: "2 / 3",
              borderRadius: "16px",
              bgcolor: alpha(isDark ? "#ffffff" : "#000000", 0.06),
              animation: "pulseGlow 1.8s ease-in-out infinite",
              animationDelay: `${i * 0.08}s`,
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default function Home() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const backgroundSx = () => {
    return {
      position: "fixed",
      inset: 0,
      zIndex: -1,
      pointerEvents: "none",
      backgroundColor: isDark ? "#07080d" : "#f4f6fb",
      backgroundImage: isDark
        ? [
            "radial-gradient(60% 50% at 15% 0%, rgba(99,102,241,0.22) 0%, transparent 70%)",
            "radial-gradient(50% 45% at 90% 8%, rgba(236,72,153,0.12) 0%, transparent 70%)",
            "radial-gradient(70% 50% at 50% 100%, rgba(14,165,233,0.12) 0%, transparent 70%)",
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.35) 100%)",
            "linear-gradient(180deg, #0b0d16 0%, #07080d 100%)",
          ].join(",")
        : [
            "radial-gradient(60% 50% at 15% 0%, rgba(99,102,241,0.14) 0%, transparent 70%)",
            "radial-gradient(50% 45% at 90% 8%, rgba(236,72,153,0.08) 0%, transparent 70%)",
            "radial-gradient(70% 50% at 50% 100%, rgba(14,165,233,0.10) 0%, transparent 70%)",
            "linear-gradient(180deg, #f8f9fd 0%, #eef1f8 100%)",
          ].join(","),
    };
  };

  const { lastSearch, setLastSearch } = useApp();
  const [input, setInput] = useState(lastSearch);
  const [query, setQuery] = useState(lastSearch);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const sentinel = useRef(null);

  // Wait 500ms after typing stops, then start a fresh search & save it.
  useEffect(() => {
    const t = setTimeout(() => {
      const q = input.trim();
      setQuery(q);
      setLastSearch(q);
      setMovies([]);
      setPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [input, setLastSearch]);

  // Load trending (no query) or search results for the current page.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    (query ? searchMovies(query, page) : getTrending(page))
      .then((d) => {
        if (cancelled) return;
        setMovies((prev) => (page === 1 ? d.results : [...prev, ...d.results.filter((r) => !prev.some((p) => p.id === r.id))]));
        setTotalPages(Math.min(d.total_pages, 500));
      })
      .catch((e) => !cancelled && setError(errorMessage(e)))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [query, page]);

  // Infinite scroll
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && !error && page < totalPages) setPage((p) => p + 1);
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, error, page, totalPages]);

  const accent = isDark ? "#a78bfa" : "#6c63ff";
  const isFirstPageLoading = loading && movies.length === 0;

  return (
    <>
      <Box aria-hidden="true" sx={backgroundSx} />
      <Stack spacing={{ xs: 2.5, sm: 3 }}>
        {/* Search bar */}
        <Box sx={{ animation: "fadeInUp 0.5s ease both" }}>
          <SearchBar value={input} onChange={setInput} />
        </Box>

        {/* Section heading */}
        <Box sx={{ animation: "fadeInUp 0.5s ease both", animationDelay: "0.1s" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 0.3 }}>
            {query ? (
              <SearchRoundedIcon sx={{ color: accent, fontSize: 26 }} />
            ) : (
              <TrendingUpRoundedIcon sx={{ color: accent, fontSize: 26 }} />
            )}
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "1.3rem", sm: "1.55rem" },
                fontWeight: 800,
                letterSpacing: "-0.02em",
                overflowWrap: "anywhere",
              }}
            >
              {query ? `Results for "${query}"` : "Trending This Week"}
            </Typography>
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
            {query
              ? "Showing the best matches from TMDb"
              : "Discover what everyone is watching right now"}
          </Typography>
        </Box>

        {/* Error state */}
        {error && (
          <Box
            sx={{
              animation: "scaleIn 0.35s ease both",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              py: 5,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: alpha("#f44336", 0.1),
              }}
            >
              <SentimentDissatisfiedRoundedIcon
                sx={{ fontSize: 32, color: "#f44336" }}
              />
            </Box>
            <Alert
              severity="error"
              variant="outlined"
              sx={{
                maxWidth: 480,
                width: "100%",
                borderRadius: "14px",
                border: `1px solid ${alpha("#f44336", 0.25)}`,
                bgcolor: alpha("#f44336", 0.04),
              }}
            >
              {error}
            </Alert>
            <Button
              variant="outlined"
              startIcon={<ReplayRoundedIcon />}
              onClick={() => {
                setError("");
                setMovies([]);
                setPage(1);
              }}
              sx={{
                borderRadius: "12px",
                px: 3,
                borderColor: alpha("#f44336", 0.3),
                color: "#f44336",
                "&:hover": {
                  borderColor: "#f44336",
                  bgcolor: alpha("#f44336", 0.06),
                },
              }}
            >
              Try Again
            </Button>
          </Box>
        )}

        {/* Empty state */}
        {!loading && !error && movies.length === 0 && (
          <Box
            sx={{
              animation: "scaleIn 0.4s ease both",
              textAlign: "center",
              py: 8,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "20px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: alpha(accent, 0.08),
                mb: 2.5,
              }}
            >
              <MovieFilterRoundedIcon
                sx={{ fontSize: 40, color: accent, opacity: 0.7 }}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 0.5 }}
            >
              No movies found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try a different title or check your spelling
            </Typography>
          </Box>
        )}

        {/* Skeleton loading for first page */}
        {isFirstPageLoading && <MovieSkeletonGrid />}

        {/* Movie grid */}
        {movies.length > 0 && <MovieGrid movies={movies} />}

        {/* Sentinel for infinite scroll */}
        <div ref={sentinel} />

        {/* Loading more indicator */}
        {loading && movies.length > 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 3,
              animation: "fadeIn 0.3s ease both",
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.5,
                px: 3,
                py: 1.2,
                borderRadius: "12px",
                bgcolor: alpha(accent, 0.08),
                border: `1px solid ${alpha(accent, 0.15)}`,
              }}
            >
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  border: `2px solid ${alpha(accent, 0.3)}`,
                  borderTopColor: accent,
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  "@keyframes spin": {
                    to: { transform: "rotate(360deg)" },
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: accent, fontSize: "0.82rem" }}
              >
                Loading more movies...
              </Typography>
            </Box>
          </Box>
        )}
      </Stack>
    </>
  );
}