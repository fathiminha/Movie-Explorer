import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Box, Button, Paper, TextField, Typography, Alert, alpha, useTheme,
  InputAdornment, IconButton,
} from "@mui/material";
import { useApp } from "../context/AppContext";
import MovieFilterRoundedIcon from "@mui/icons-material/MovieFilterRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

// Front end only login ( any username + a password of 4+ characters.)
export default function Login() {
  const { user, login } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accent = isDark ? "#a78bfa" : "#6c63ff";

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || password.length < 4) {
      setError("Enter a username and a password of at least 4 characters.");
      return;
    }
    login(username.trim());
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        p: 2,
        background: isDark
          ? [
            "radial-gradient(60% 50% at 20% 10%, rgba(99,102,241,0.2) 0%, transparent 70%)",
            "radial-gradient(50% 45% at 85% 15%, rgba(236,72,153,0.1) 0%, transparent 70%)",
            "linear-gradient(180deg, #0b0d16 0%, #07080d 100%)",
          ].join(",")
          : [
            "radial-gradient(60% 50% at 20% 10%, rgba(99,102,241,0.12) 0%, transparent 70%)",
            "radial-gradient(50% 45% at 85% 15%, rgba(236,72,153,0.06) 0%, transparent 70%)",
            "linear-gradient(180deg, #f8f9fd 0%, #eef1f8 100%)",
          ].join(","),
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          width: "100%",
          maxWidth: 420,
          display: "grid",
          gap: 2.5,
          borderRadius: "24px",
          bgcolor: isDark ? alpha("#111327", 0.85) : alpha("#ffffff", 0.85),
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid ${alpha(isDark ? "#ffffff" : "#000000", 0.08)}`,
          boxShadow: isDark
            ? `0 16px 64px ${alpha("#000", 0.4)}`
            : `0 16px 64px ${alpha("#6c63ff", 0.08)}`,
          animation: "scaleIn 0.45s ease both",
        }}
      >
        {/* Logo & Title */}
        <Box sx={{ textAlign: "center", mb: 1 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "16px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${accent}, ${isDark ? "#e040fb" : "#e040fb"})`,
              boxShadow: `0 4px 20px ${alpha(accent, 0.35)}`,
              mb: 2,
            }}
          >
            <MovieFilterRoundedIcon sx={{ color: "#fff", fontSize: 28 }} />
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.02em",
              fontSize: "1.4rem",
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mt: 0.5, fontSize: "0.88rem" }}
          >
            Sign in to Movie Explorer
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            variant="outlined"
            sx={{
              borderRadius: "12px",
              border: `1px solid ${alpha("#f44336", 0.25)}`,
              bgcolor: alpha("#f44336", 0.04),
            }}
          >
            {error}
          </Alert>
        )}

        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonRoundedIcon sx={{ fontSize: 20, color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              transition: "all 0.25s ease",
              "&.Mui-focused": {
                boxShadow: `0 0 0 3px ${alpha(accent, 0.12)}`,
              },
            },
          }}
        />

        <TextField
          label="Password"
          type={showPw ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockRoundedIcon sx={{ fontSize: 20, color: "text.secondary" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPw((v) => !v)}
                  edge="end"
                  size="small"
                  tabIndex={-1}
                >
                  {showPw ? (
                    <VisibilityOffRoundedIcon sx={{ fontSize: 20 }} />
                  ) : (
                    <VisibilityRoundedIcon sx={{ fontSize: 20 }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              transition: "all 0.25s ease",
              "&.Mui-focused": {
                boxShadow: `0 0 0 3px ${alpha(accent, 0.12)}`,
              },
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          endIcon={<LoginRoundedIcon />}
          sx={{
            borderRadius: "14px",
            py: 1.4,
            fontWeight: 700,
            fontSize: "0.95rem",
            background: `linear-gradient(135deg, ${accent}, ${isDark ? "#e040fb" : "#e040fb"})`,
            boxShadow: `0 4px 20px ${alpha(accent, 0.35)}`,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: `0 6px 28px ${alpha(accent, 0.45)}`,
              transform: "translateY(-1px)",
            },
          }}
        >
          Sign In
        </Button>
      </Paper>
    </Box>
  );
}