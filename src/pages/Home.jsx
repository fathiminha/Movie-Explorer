import { useEffect, useRef, useState } from "react";
import { Typography, CircularProgress, Alert, Box, Stack } from "@mui/material";
import SearchBar from "../components/SearchBar";
import MovieGrid from "../components/MovieGrid";
import { getTrending, searchMovies, errorMessage } from "../api/tmdb";
import { useApp } from "../context/AppContext";

export default function Home() {
  const backgroundSx = (theme) => {
    const dark = theme.palette.mode === "dark";
    return {
      position: "fixed",
      inset: 0,
      zIndex: -1,
      pointerEvents: "none",
      backgroundColor: dark ? "#07080d" : "#f4f6fb",
      backgroundImage: dark
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

  return (
    <>
      <Box aria-hidden="true" sx={backgroundSx} />
      <Stack spacing={3}>
        <SearchBar value={input} onChange={setInput} />
        <Typography variant="h5" sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" }, overflowWrap: "anywhere" }}>
          {query ? `Results for "${query}"` : "Trending this week"}
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && movies.length === 0 && <Typography>No movies found. Try a different title.</Typography>}
        <MovieGrid movies={movies} />
        <div ref={sentinel} />
        {loading && <Box sx={{ textAlign: "center" }}><CircularProgress /></Box>}
      </Stack>
    </>
  );
}