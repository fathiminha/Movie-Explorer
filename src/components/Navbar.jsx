import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Button, IconButton, Box, Avatar,
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider,
  useTheme, alpha, Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import { useApp } from "../context/AppContext";

function isActive(path, loc) {
  if (path === "/") return loc === "/";
  return loc.startsWith(path);
}

function NavLink({ to, label, icon, active, theme }) {
  const accent = theme.palette.mode === "dark" ? "#a78bfa" : "#6c63ff";
  return (
    <Button
      component={Link}
      to={to}
      startIcon={icon}
      sx={{
        color: active
          ? accent
          : alpha(theme.palette.common.white, 0.85),
        fontWeight: active ? 700 : 500,
        fontSize: "0.84rem",
        letterSpacing: "0.03em",
        textTransform: "none",
        px: 2,
        py: 0.75,
        borderRadius: "10px",
        position: "relative",
        transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
        background: active
          ? alpha(accent, 0.12)
          : "transparent",
        "&::after": active
          ? {
            content: '""',
            position: "absolute",
            bottom: 4,
            left: "30%",
            width: "40%",
            height: 2.5,
            borderRadius: 2,
            background: accent,
          }
          : {},
        "&:hover": {
          background: alpha(accent, 0.10),
          color: accent,
          transform: "translateY(-1px)",
        },
      }}
    >
      {label}
    </Button>
  );
}

export default function Navbar() {
  const { mode, toggleMode, logout, user } = useApp();
  const [open, setOpen] = useState(false); // mobile menu open/closed
  const close = () => setOpen(false);
  const theme = useTheme();
  const location = useLocation().pathname;

  const isDark = mode === "dark";
  const accent = isDark ? "#a78bfa" : "#6c63ff";

  /* glass surface */
  const glassBg = isDark
    ? alpha("#0d0d1a", 0.72)
    : alpha("#ffffff", 0.65);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: glassBg,
        backdropFilter: "blur(18px) saturate(1.6)",
        WebkitBackdropFilter: "blur(18px) saturate(1.6)",
        borderBottom: `1px solid ${alpha(
          isDark ? "#ffffff" : "#000000",
          0.08
        )}`,
        boxShadow: isDark
          ? `0 4px 30px ${alpha("#000", 0.35)}`
          : `0 4px 24px ${alpha("#6c63ff", 0.08)}`,
        transition: "background 0.35s ease, box-shadow 0.35s ease",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: 1280,
          width: "100%",
          mx: "auto",
          px: { xs: 1.5, sm: 3 },
          minHeight: { xs: 56, sm: 64 },
          gap: 1,
        }}
      >
        {/* ── Logo ── */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            textDecoration: "none",
            mr: "auto",
            "&:hover .logo-icon": {
              transform: "rotate(18deg) scale(1.12)",
            },
          }}
        >
          <Box
            className="logo-icon"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: `linear-gradient(135deg, ${accent}, ${isDark ? "#7c4dff" : "#e040fb"
                })`,
              boxShadow: `0 2px 12px ${alpha(accent, 0.45)}`,
              transition: "transform 0.3s cubic-bezier(.4,0,.2,1)",
            }}
          >
            <MovieFilterIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.05rem", sm: "1.18rem" },
              letterSpacing: "-0.01em",
              background: `linear-gradient(135deg, ${isDark ? "#f5f5f5" : "#1a1a2e"
                } 30%, ${accent})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              userSelect: "none",
            }}
          >
            Movie Explorer
          </Typography>
        </Box>

        {/* ── Desktop / tablet links ── */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <NavLink
            to="/"
            label="Home"
            icon={<HomeIcon sx={{ fontSize: 18 }} />}
            active={isActive("/", location)}
            theme={theme}
          />
          <NavLink
            to="/favorites"
            label="Favorites"
            icon={<FavoriteIcon sx={{ fontSize: 18 }} />}
            active={isActive("/favorites", location)}
            theme={theme}
          />

          {/* mode toggle */}
          <IconButton
            onClick={toggleMode}
            aria-label="Toggle light or dark mode"
            sx={{
              color: alpha(theme.palette.common.white, 0.8),
              mx: 0.5,
              width: 38,
              height: 38,
              borderRadius: "10px",
              transition: "all 0.25s ease",
              "&:hover": {
                background: alpha(accent, 0.12),
                color: accent,
                transform: "rotate(25deg)",
              },
            }}
          >
            {isDark ? (
              <LightModeIcon sx={{ fontSize: 20 }} />
            ) : (
              <DarkModeIcon sx={{ fontSize: 20 }} />
            )}
          </IconButton>

          {/* logout chip */}
          <Chip
            label={`Log out (${user})`}
            onClick={logout}
            icon={<LogoutIcon sx={{ fontSize: 16 }} />}
            variant="outlined"
            size="small"
            sx={{
              ml: 0.5,
              color: alpha(theme.palette.common.white, 0.8),
              borderColor: alpha(theme.palette.common.white, 0.18),
              borderRadius: "10px",
              fontWeight: 500,
              fontSize: "0.78rem",
              height: 34,
              transition: "all 0.25s ease",
              "& .MuiChip-icon": {
                color: alpha(theme.palette.common.white, 0.7),
                transition: "color 0.25s ease",
              },
              "&:hover": {
                borderColor: accent,
                background: alpha(accent, 0.10),
                color: accent,
                "& .MuiChip-icon": { color: accent },
              },
            }}
          />
        </Box>

        {/* ── Hamburger (phones only) ── */}
        <IconButton
          edge="end"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          sx={{
            display: { xs: "flex", sm: "none" },
            color: isDark ? "#fff" : "#1a1a2e",
            width: 40,
            height: 40,
            borderRadius: "10px",
            transition: "all 0.25s ease",
            "&:hover": {
              background: alpha(accent, 0.12),
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* ── Slide-in mobile drawer ── */}
      <Drawer
        anchor="right"
        open={open}
        onClose={close}
        PaperProps={{
          sx: {
            width: 280,
            background: isDark
              ? alpha("#0d0d1a", 0.92)
              : alpha("#ffffff", 0.92),
            backdropFilter: "blur(24px) saturate(1.4)",
            WebkitBackdropFilter: "blur(24px) saturate(1.4)",
            borderLeft: `1px solid ${alpha(
              isDark ? "#ffffff" : "#000000",
              0.06
            )}`,
          },
        }}
      >
        <Box role="presentation" sx={{ height: "100%" }}>
          {/* drawer header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              pt: 2,
              pb: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${accent}, ${isDark ? "#7c4dff" : "#e040fb"
                    })`,
                }}
              >
                {user ? user.charAt(0).toUpperCase() : "U"}
              </Avatar>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, lineHeight: 1.2 }}
                >
                  {user}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.7rem",
                  }}
                >
                  Movie Explorer
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={close}
              size="small"
              sx={{
                color: "text.secondary",
                borderRadius: "8px",
                "&:hover": { color: accent },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider sx={{ opacity: 0.5, mx: 1.5 }} />

          {/* drawer nav items */}
          <List sx={{ px: 1, pt: 1 }}>
            {[
              {
                to: "/",
                icon: <HomeIcon />,
                label: "Home",
              },
              {
                to: "/favorites",
                icon: <FavoriteIcon />,
                label: "Favorites",
              },
            ].map((item) => {
              const active = isActive(item.to, location);
              return (
                <ListItemButton
                  key={item.to}
                  component={Link}
                  to={item.to}
                  onClick={close}
                  sx={{
                    borderRadius: "10px",
                    mb: 0.5,
                    py: 1.2,
                    transition: "all 0.2s ease",
                    background: active
                      ? alpha(accent, 0.10)
                      : "transparent",
                    "&:hover": {
                      background: alpha(accent, 0.08),
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: active ? accent : "text.secondary",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 700 : 500,
                      fontSize: "0.92rem",
                      color: active ? accent : "text.primary",
                    }}
                  />
                  {active && (
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: accent,
                        boxShadow: `0 0 8px ${alpha(accent, 0.6)}`,
                      }}
                    />
                  )}
                </ListItemButton>
              );
            })}

            {/* theme toggle */}
            <ListItemButton
              onClick={() => {
                toggleMode();
                close();
              }}
              sx={{
                borderRadius: "10px",
                mb: 0.5,
                py: 1.2,
                transition: "all 0.2s ease",
                "&:hover": {
                  background: alpha(accent, 0.08),
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "text.secondary" }}>
                {isDark ? <LightModeIcon /> : <DarkModeIcon />}
              </ListItemIcon>
              <ListItemText
                primary={isDark ? "Light mode" : "Dark mode"}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "0.92rem",
                }}
              />
            </ListItemButton>

            <Divider sx={{ opacity: 0.4, my: 1, mx: 0.5 }} />

            {/* logout */}
            <ListItemButton
              onClick={() => {
                close();
                logout();
              }}
              sx={{
                borderRadius: "10px",
                py: 1.2,
                transition: "all 0.2s ease",
                "&:hover": {
                  background: alpha("#f44336", 0.08),
                  "& .MuiListItemIcon-root": { color: "#f44336" },
                  "& .MuiListItemText-primary": { color: "#f44336" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "text.secondary" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Log out"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "0.92rem",
                }}
              />
            </ListItemButton>
          </List>

          {/* drawer footer branding */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              opacity: 0.5,
            }}
          >
            <MovieFilterIcon sx={{ fontSize: 16, color: accent }} />
            <Typography variant="caption" sx={{ fontSize: "0.68rem" }}>
              Movie Explorer
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}