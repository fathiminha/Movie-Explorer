import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Box, Button, CircularProgress, GlobalStyles, IconButton, InputAdornment,
  TextField, ThemeProvider, Typography, createTheme,
} from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import MovieFilterRoundedIcon from "@mui/icons-material/MovieFilterRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import { useApp } from "../context/AppContext";
import { getTrending, IMG } from "../api/tmdb";

// The login page is always dark, whatever mode the app is in.
const darkTheme = createTheme({ palette: { mode: "dark", primary: { main: "#a78bfa" } } });

const TAGLINES = ["Discover trending films", "Search millions of movies", "Save your favorites", "Watch trailers instantly"];

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    bgcolor: "rgba(255,255,255,0.04)",
    transition: "box-shadow 0.25s ease",
    "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
    "&:hover fieldset": { borderColor: "rgba(167,139,250,0.55)" },
    "&.Mui-focused": { boxShadow: "0 0 0 4px rgba(167,139,250,0.18)" },
  },
};

export default function Login() {
  const { user, login } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [caps, setCaps] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posters, setPosters] = useState([]);
  const [tip, setTip] = useState(0);

  // Trending posters for the animated background (optional, ignored if it fails).
  useEffect(() => {
    getTrending(1)
      .then((d) => setPosters(d.results.filter((m) => m.poster_path).map((m) => m.poster_path)))
      .catch(() => { });
  }, []);

  // Rotate the tagline under the title.
  useEffect(() => {
    const t = setInterval(() => setTip((i) => (i + 1) % TAGLINES.length), 2800);
    return () => clearInterval(t);
  }, []);

  if (user) return <Navigate to="/" replace />;

  const columns = [0, 1, 2, 3, 4].map((c) => posters.filter((_, i) => i % 5 === c));

  // Moves the spotlight glow to the cursor (no re-render needed).
  const handleMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  const DEMO_USERNAME = "user";
  const DEMO_PASSWORD = "User@123";

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!username.trim()) errs.username = "Enter your username";
    if (!password) errs.password = "Enter your password";
    if (Object.keys(errs).length) {
      setErrors(errs);
      setShake(true);
      return;
    }
    if (username.trim() !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
      setErrors({ general: "Invalid username or password." });
      setShake(true);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      login(username.trim());
      navigate("/");
    }, 700);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyles
        styles={{
          "@keyframes loginRise": { from: { opacity: 0, transform: "translateY(24px) scale(0.97)" }, to: { opacity: 1, transform: "none" } },
          "@keyframes loginFade": { from: { opacity: 0, transform: "translateY(6px)" }, to: { opacity: 1, transform: "none" } },
          "@keyframes loginShake": { "0%,100%": { transform: "translateX(0)" }, "20%,60%": { transform: "translateX(-8px)" }, "40%,80%": { transform: "translateX(8px)" } },
          "@keyframes loginDriftUp": { from: { transform: "translateY(0)" }, to: { transform: "translateY(-33.3333%)" } },
          "@keyframes loginDriftDown": { from: { transform: "translateY(-33.3333%)" }, to: { transform: "translateY(0)" } },
        }}
      />
      <Box
        onMouseMove={handleMouseMove}
        sx={{ position: "relative", minHeight: "100vh", overflow: "hidden", display: "grid", placeItems: "center", p: 2, bgcolor: "#07080d", color: "#fff" }}
      >
        {/* Drifting poster wall */}
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute", inset: "-15%", display: "grid", gap: 2, opacity: 0.35, transform: "rotate(-8deg)",
            gridTemplateColumns: { xs: "repeat(3, 1fr)", md: "repeat(5, 1fr)" },
          }}
        >
          {columns.map((col, i) => (
            <Box
              key={i}
              sx={{
                display: { xs: i < 3 ? "flex" : "none", md: "flex" },
                flexDirection: "column",
                animation: `${i % 2 ? "loginDriftDown" : "loginDriftUp"} ${55 + i * 8}s linear infinite`,
                "@media (prefers-reduced-motion: reduce)": { animation: "none" },
              }}
            >
              {[...col, ...col, ...col].map((p, k) => (
                <Box key={k} component="img" src={IMG + p} alt="" loading="lazy" sx={{ width: "100%", borderRadius: 2, mb: 2, display: "block" }} />
              ))}
            </Box>
          ))}
        </Box>

        {/* Dark overlay + cursor spotlight */}
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse at center, rgba(7,8,13,0.55) 0%, rgba(7,8,13,0.93) 80%), linear-gradient(180deg, rgba(7,8,13,0.6), rgba(7,8,13,0.9))",
          }}
        />
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(450px circle at var(--x, 50%) var(--y, 40%), rgba(167,139,250,0.22), transparent 65%)",
          }}
        />

        {/* Login card */}
        <Box
          sx={{
            position: "relative", zIndex: 1, width: "100%", maxWidth: 420, borderRadius: 5, p: { xs: 3, sm: 4.5 },
            bgcolor: "rgba(15,17,30,0.72)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(167,139,250,0.12)",
            animation: "loginRise 0.7s ease both",
          }}
        >
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            onAnimationEnd={() => setShake(false)}
            sx={{ display: "grid", gap: 2.2, animation: shake ? "loginShake 0.4s" : "none" }}
          >
            <Box sx={{ textAlign: "center", mb: 1 }}>
              <Box
                sx={{
                  width: 64, height: 64, mx: "auto", mb: 2, borderRadius: 3, display: "grid", placeItems: "center",
                  background: "linear-gradient(135deg,#a78bfa,#e040fb)", boxShadow: "0 10px 30px rgba(167,139,250,0.45)",
                }}
              >
                <MovieFilterRoundedIcon sx={{ fontSize: 34 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Welcome Back</Typography>
              <Typography key={tip} sx={{ mt: 0.5, color: "rgba(255,255,255,0.65)", minHeight: 24, animation: "loginFade 0.6s ease both" }}>
                {TAGLINES[tip]}
              </Typography>
            </Box>

            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!errors.username}
              helperText={errors.username}
              autoComplete="username"
              autoFocus
              sx={fieldSx}
              InputProps={{ startAdornment: <InputAdornment position="start"><PersonRoundedIcon /></InputAdornment> }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={(e) => setCaps(e.getModifierState("CapsLock"))}
              error={!!errors.password}
              helperText={errors.password}
              autoComplete="current-password"
              sx={fieldSx}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockRoundedIcon /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" aria-label="Show or hide password">
                      {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {caps && <Typography variant="caption" sx={{ color: "#ffb74d", mt: -1 }}>Caps Lock is on</Typography>}

            <Button
              type="submit"
              disabled={loading}
              size="large"
              endIcon={!loading && <LoginRoundedIcon />}
              sx={{
                py: 1.4, borderRadius: 3, fontWeight: 700, color: "#fff",
                background: "linear-gradient(135deg,#a78bfa,#e040fb)", boxShadow: "0 10px 30px rgba(167,139,250,0.35)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": { transform: "translateY(-2px)", boxShadow: "0 14px 36px rgba(224,64,251,0.45)" },
                "&.Mui-disabled": { color: "#fff", opacity: 0.85 },
              }}
            >
              {loading ? (<><CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> Signing in…</>) : "Sign In"}
            </Button>

            {errors.general && (
              <Typography variant="body2" sx={{ textAlign: "center", color: "#f87171", fontWeight: 500, mt: -0.5 }}>
                {errors.general}
              </Typography>
            )}
            <Typography variant="caption" sx={{ textAlign: "center", color: "rgba(255,255,255,0.45)" }}>
              User credentials: Username: user | Password: User@123
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}