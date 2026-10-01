import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Alert, Avatar, Box, Button, Chip, IconButton, Link as MuiLink, Skeleton, Stack, Typography,
  alpha, useTheme,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import { getMovie, errorMessage, IMG } from "../api/tmdb";
import { useApp } from "../context/AppContext";

const BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";
const PROFILE_BASE = "https://image.tmdb.org/t/p/w185";
const SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';

/* Section heading*/
function SectionTitle({ children, accent, action }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
      <Typography variant="h6" sx={{ fontSize: "1.15rem", fontWeight: 700, pl: 1.5, lineHeight: 1.2, borderLeft: `3px solid ${accent}` }}>
        {children}
      </Typography>
      {action}
    </Box>
  );
}

/* One row of the Movie Details card */
function InfoRow({ icon, label, value }) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "24px 105px 1fr", alignItems: "center", columnGap: 1.5 }}>
      <Box sx={{ color: "text.secondary", display: "flex" }}>{icon}</Box>
      <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>{label}</Typography>
      <Typography sx={{ fontSize: "0.9rem", fontWeight: 500, overflowWrap: "anywhere" }}>{value || "—"}</Typography>
    </Box>
  );
}

/* Skeleton placeholder while the movie loads */
function DetailsSkeleton() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const skBg = alpha(isDark ? "#ffffff" : "#000000", 0.06);
  return (
    <Box sx={{ animation: "fadeIn 0.3s ease both" }}>
      <Skeleton variant="rounded" sx={{ width: "100%", height: { xs: 220, md: 380 }, borderRadius: "20px", bgcolor: skBg, mb: 3 }} />
      <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
        <Skeleton variant="rounded" sx={{ width: { xs: "60%", md: 240 }, aspectRatio: "2/3", borderRadius: "16px", bgcolor: skBg, alignSelf: { xs: "center", md: "flex-start" } }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" sx={{ fontSize: "2rem", width: "70%", bgcolor: skBg }} />
          <Skeleton variant="text" sx={{ fontSize: "1rem", width: "40%", bgcolor: skBg, mt: 1 }} />
          <Skeleton variant="rounded" sx={{ height: 80, width: "100%", bgcolor: skBg, mt: 2, borderRadius: "12px" }} />
          <Skeleton variant="rounded" sx={{ height: 40, width: 180, bgcolor: skBg, mt: 2, borderRadius: "10px" }} />
        </Box>
      </Box>
    </Box>
  );
}

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useApp();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const castRef = useRef(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    setMovie(null);
    setError("");
    getMovie(id).then(setMovie).catch((e) => setError(errorMessage(e)));
  }, [id]);

  const accent = isDark ? "#a78bfa" : "#6c63ff";

  if (error)
    return (
      <Box
        sx={{
          animation: "scaleIn 0.35s ease both",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          py: 8,
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
          <SentimentDissatisfiedRoundedIcon sx={{ fontSize: 32, color: "#f44336" }} />
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
            setMovie(null);
            getMovie(id).then(setMovie).catch((e) => setError(errorMessage(e)));
          }}
          sx={{
            borderRadius: "12px",
            px: 3,
            borderColor: alpha("#f44336", 0.3),
            color: "#f44336",
            "&:hover": { borderColor: "#f44336", bgcolor: alpha("#f44336", 0.06) },
          }}
        >
          Try Again
        </Button>
      </Box>
    );

  if (!movie) return <DetailsSkeleton />;

  const trailer = movie.videos?.results.find((v) => v.site === "YouTube" && v.type === "Trailer");
  const castList = (movie.credits?.cast ?? []).slice(0, 12);
  const crew = movie.credits?.crew ?? [];
  const director = crew.find((c) => c.job === "Director")?.name;
  const writers = [...new Set(crew.filter((c) => c.department === "Writing").map((c) => c.name))].slice(0, 2).join(", ");
  const fav = isFavorite(movie.id);
  const backdrop = movie.backdrop_path ? BACKDROP_BASE + movie.backdrop_path : null;
  const year = movie.release_date?.slice(0, 4) || "N/A";
  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })
    : "N/A";
  const language = movie.spoken_languages?.[0]?.english_name || movie.original_language?.toUpperCase();
  const country = movie.production_countries?.map((c) => c.name).join(", ");
  const base = isDark ? "7,8,13" : "244,246,251";
  const glass = {
    bgcolor: alpha(isDark ? "#ffffff" : "#000000", isDark ? 0.06 : 0.04),
    border: `1px solid ${alpha(isDark ? "#ffffff" : "#000000", 0.1)}`,
    backdropFilter: "blur(12px)",
  };
  const scrollCast = (dir) => castRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <>
      {/* Full-screen cinematic backdrop (fixed, behind everything) */}
      <Box
        aria-hidden="true"
        sx={{
          position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none",
          backgroundColor: `rgb(${base})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          backgroundImage: backdrop
            ? `linear-gradient(90deg, rgba(${base},0.9) 0%, rgba(${base},0.35) 55%, rgba(${base},0.1) 100%), linear-gradient(180deg, rgba(${base},0.2) 0%, rgba(${base},0.7) 55%, rgb(${base}) 100%), url(${backdrop})`
            : "none",
        }}
      />

      <Stack spacing={{ xs: 3, md: 5 }} sx={{ animation: "fadeInUp 0.5s ease both" }}>
        <Box>
          <Button
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackRoundedIcon />}
            sx={{ color: "text.secondary", borderRadius: 99, px: 2, ...glass, "&:hover": { color: accent } }}
          >
            Back
          </Button>
        </Box>

        {/* Hero */}
        <Box sx={{ display: "flex", gap: { xs: 3, md: 4 }, flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "center", sm: "flex-start" } }}>
          {movie.poster_path && (
            <Box
              component="img"
              src={IMG + movie.poster_path}
              alt={movie.title}
              sx={{
                width: { xs: "55%", sm: 190, md: 230 },
                maxWidth: 260,
                borderRadius: 3,
                flexShrink: 0,
                border: `1px solid ${alpha("#ffffff", 0.15)}`,
                boxShadow: "0 20px 50px rgba(0,0,0,0.55)",
                animation: "scaleIn 0.4s ease both",
              }}
            />
          )}
          <Stack spacing={2} sx={{ minWidth: 0, width: "100%", maxWidth: 720 }}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {movie.genres.map((g) => (
                <Chip
                  key={g.id}
                  label={g.name}
                  size="small"
                  onClick={() => navigate(`/?genre=${g.id}`)}
                  sx={{
                    ...glass,
                    fontWeight: 500,
                    borderRadius: 99,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": { bgcolor: alpha(accent, 0.12), borderColor: alpha(accent, 0.4) }
                  }}
                />
              ))}
            </Box>

            <Typography
              component="h1"
              sx={{ fontFamily: SERIF, fontWeight: 700, lineHeight: 1.1, overflowWrap: "anywhere", fontSize: { xs: "2.1rem", sm: "2.8rem", md: "3.6rem" } }}
            >
              {movie.title}{" "}
              <Typography component="span" sx={{ fontFamily: SERIF, fontWeight: 400, color: "text.secondary", fontSize: "0.5em" }}>
                ({year})
              </Typography>
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.6, px: 1.4, py: 0.5, borderRadius: 99, bgcolor: alpha("#ffc107", 0.14), border: `1px solid ${alpha("#ffc107", 0.3)}` }}>
                <StarRoundedIcon sx={{ fontSize: 18, color: "#ffc107" }} />
                <Typography sx={{ fontWeight: 700, fontSize: "0.88rem" }}>{movie.vote_average?.toFixed(1)}</Typography>
                <Typography sx={{ fontSize: "0.78rem", color: "text.secondary" }}>/ 10</Typography>
              </Box>
              {movie.runtime > 0 && (
                <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.6, color: "text.secondary" }}>
                  <AccessTimeRoundedIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2">{movie.runtime} min</Typography>
                </Box>
              )}
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.6, color: "text.secondary" }}>
                <CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2">{year}</Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                color: "text.secondary", lineHeight: 1.7, maxWidth: 580, overflowWrap: "anywhere",
                display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
              }}
            >
              {movie.overview || "No overview available."}
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              {trailer && (
                <Button
                  variant="contained"
                  startIcon={<PlayArrowRoundedIcon />}
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    borderRadius: 99, px: 3.5, py: 1.2, fontWeight: 600,
                    background: `linear-gradient(135deg, ${accent}, #7c3aed)`,
                    boxShadow: `0 6px 22px ${alpha(accent, 0.4)}`,
                    "&:hover": { boxShadow: `0 8px 28px ${alpha(accent, 0.55)}` },
                  }}
                >
                  Watch Trailer
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={fav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                onClick={() => toggleFavorite(movie)}
                sx={{
                  borderRadius: 99, px: 3.5, py: 1.2, fontWeight: 600, ...glass,
                  color: fav ? "#ff4d6d" : "text.primary",
                  borderColor: fav ? "#ff4d6d" : alpha(isDark ? "#fff" : "#000", 0.25),
                  "&:hover": { borderColor: fav ? "#ff4d6d" : accent, bgcolor: alpha(fav ? "#ff4d6d" : accent, 0.1) },
                }}
              >
                {fav ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/*  Content */}
        <Box sx={{ display: "grid", gap: { xs: 4, md: 5 }, gridTemplateColumns: { xs: "minmax(0,1fr)", md: "minmax(0,1fr) 340px" }, alignItems: "start" }}>
          <Stack spacing={4} sx={{ minWidth: 0 }}>
            {trailer && (
              <Box>
                <SectionTitle
                  accent={accent}
                  action={
                    <MuiLink href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noreferrer" underline="none" sx={{ color: "text.secondary", fontSize: "0.85rem", "&:hover": { color: accent } }}>
                      Watch on YouTube
                    </MuiLink>
                  }
                >
                  Trailer
                </SectionTitle>
                <Box
                  component="iframe"
                  title="Trailer"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  allowFullScreen
                  sx={{ width: "100%", aspectRatio: "16 / 9", border: `1px solid ${alpha("#fff", 0.12)}`, borderRadius: 3, boxShadow: "0 12px 40px rgba(0,0,0,0.45)", display: "block" }}
                />
              </Box>
            )}

            <Box>
              <SectionTitle accent={accent}>Cast</SectionTitle>
              {castList.length === 0 ? (
                <Typography sx={{ color: "text.secondary" }}>Cast information not available.</Typography>
              ) : (
                <Box sx={{ position: "relative" }}>
                  <Box
                    ref={castRef}
                    sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1, scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}
                  >
                    {castList.map((c) => (
                      <Box key={c.id} sx={{ flex: "0 0 auto", width: 96, textAlign: "center" }}>
                        <Avatar
                          src={c.profile_path ? PROFILE_BASE + c.profile_path : undefined}
                          alt={c.name}
                          sx={{ width: 72, height: 72, mx: "auto", mb: 1, border: `2px solid ${alpha(accent, 0.5)}` }}
                        >
                          {c.name?.[0]}
                        </Avatar>
                        <Typography noWrap title={c.name} sx={{ fontSize: "0.8rem", fontWeight: 600 }}>{c.name}</Typography>
                        <Typography noWrap title={c.character} sx={{ fontSize: "0.75rem", color: "text.secondary" }}>{c.character}</Typography>
                      </Box>
                    ))}
                  </Box>
                  {[-1, 1].map((dir) => (
                    <IconButton
                      key={dir}
                      onClick={() => scrollCast(dir)}
                      aria-label={dir < 0 ? "Scroll cast left" : "Scroll cast right"}
                      size="small"
                      sx={{ display: { xs: "none", md: "flex" }, position: "absolute", top: 24, [dir < 0 ? "left" : "right"]: -14, ...glass, bgcolor: alpha(`rgb(${base})`, 0.85) }}
                    >
                      {dir < 0 ? <ChevronLeftRoundedIcon /> : <ChevronRightRoundedIcon />}
                    </IconButton>
                  ))}
                </Box>
              )}
            </Box>

            <Box>
              <SectionTitle accent={accent}>Overview</SectionTitle>
              <Typography sx={{ color: "text.secondary", lineHeight: 1.8, overflowWrap: "anywhere", maxWidth: 760 }}>
                {movie.overview || "No overview available."}
              </Typography>
            </Box>
          </Stack>

          {/*  Right column  */}
          <Stack spacing={3} sx={{ minWidth: 0 }}>
            <Box sx={{ ...glass, borderRadius: 3, p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                {movie.poster_path && <Box component="img" src={IMG + movie.poster_path} alt="" sx={{ width: 38, borderRadius: 1 }} />}
                <Box>
                  <Typography sx={{ fontFamily: SERIF, fontWeight: 700, fontSize: "1.15rem" }}>Movie Details</Typography>
                  <Box sx={{ width: 28, height: 2, bgcolor: accent, mt: 0.5, borderRadius: 1 }} />
                </Box>
              </Box>
              <Stack spacing={1.8}>
                <InfoRow icon={<CalendarMonthRoundedIcon fontSize="small" />} label="Release Date" value={releaseDate} />
                <InfoRow icon={<AccessTimeRoundedIcon fontSize="small" />} label="Runtime" value={movie.runtime > 0 ? `${movie.runtime} min` : ""} />
                <InfoRow icon={<LocalOfferRoundedIcon fontSize="small" />} label="Genres" value={movie.genres.map((g) => g.name).join(", ")} />
                <InfoRow icon={<LanguageRoundedIcon fontSize="small" />} label="Language" value={language} />
                <InfoRow icon={<PlaceRoundedIcon fontSize="small" />} label="Country" value={country} />
              </Stack>
              <Box sx={{ height: "1px", my: 2.5, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                {[
                  { icon: <PersonRoundedIcon sx={{ fontSize: 18 }} />, label: "Director", value: director },
                  { icon: <EditRoundedIcon sx={{ fontSize: 18 }} />, label: "Writer", value: writers },
                ].map((c) => (
                  <Box key={c.label} sx={{ minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, color: "text.secondary", mb: 0.5 }}>
                      {c.icon}
                      <Typography sx={{ fontSize: "0.85rem" }}>{c.label}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: "0.9rem", fontWeight: 500, overflowWrap: "anywhere" }}>{c.value || "—"}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {movie.tagline && (
              <Box sx={{ px: 1 }}>
                <FormatQuoteRoundedIcon sx={{ color: accent, fontSize: 32 }} />
                <Typography sx={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.1rem", lineHeight: 1.5, color: "text.secondary" }}>
                  {movie.tagline}
                </Typography>
                <Box sx={{ width: 120, height: 2, mt: 1.5, borderRadius: 1, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
              </Box>
            )}
          </Stack>
        </Box>
      </Stack>
    </>
  );
}