import { useState } from "react";
import { Box, Button, Menu, MenuItem, Typography, alpha, useTheme } from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";

export default function FilterBar({ genres, filters, setFilters }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accent = isDark ? "#a78bfa" : "#6c63ff";

  // Dropdown states
  const [anchorElGenre, setAnchorElGenre] = useState(null);
  const [anchorElYear, setAnchorElYear] = useState(null);
  const [anchorElRating, setAnchorElRating] = useState(null);

  // Generate options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => currentYear - i);
  const ratings = [6, 7, 8, 9];

  const handleChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleClose = () => {
    setAnchorElGenre(null);
    setAnchorElYear(null);
    setAnchorElRating(null);
  };

  const hasFilters = filters.genre || filters.year || filters.rating;
  const activeGenreName = filters.genre ? genres.find((g) => String(g.id) === String(filters.genre))?.name : null;

  // Shared props for sleek glassmorphism dropdown menus
  const getMenuProps = (anchorEl) => ({
    anchorEl,
    open: Boolean(anchorEl),
    onClose: handleClose,
    disableScrollLock: true,
    PaperProps: {
      elevation: 0,
      sx: {
        mt: 1,
        maxHeight: 300,
        borderRadius: "14px",
        minWidth: 150,
        overflow: "auto",
        background: isDark ? alpha("#1a1c29", 0.95) : alpha("#ffffff", 0.95),
        backdropFilter: "blur(20px)",
        border: `1px solid ${alpha(isDark ? "#ffffff" : "#000000", 0.08)}`,
        boxShadow: isDark ? "0 12px 40px rgba(0,0,0,0.5)" : "0 12px 40px rgba(0,0,0,0.12)",
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-thumb": {
          bgcolor: alpha(isDark ? "#ffffff" : "#000000", 0.1),
          borderRadius: "8px",
        },
        "& .MuiMenuItem-root": {
          fontSize: "0.85rem",
          borderRadius: "8px",
          mx: 0.8,
          my: 0.2,
          py: 0.8,
          transition: "all 0.15s ease",
          "&:hover": {
            bgcolor: alpha(accent, 0.1),
            color: accent,
          },
          "&.Mui-selected": {
            bgcolor: alpha(accent, 0.15),
            color: accent,
            fontWeight: 600,
            "&:hover": { bgcolor: alpha(accent, 0.2) },
          },
        },
      },
    },
  });

  // Highlight style for an active filter
  const activeGlass = {
    bgcolor: alpha(accent, 0.12),
    border: `1px solid ${alpha(accent, 0.3)}`,
    color: accent,
    fontWeight: 600,
  };

  // Default neutral style for an inactive filter
  const defaultGlass = {
    bgcolor: alpha(isDark ? "#ffffff" : "#000000", 0.04),
    border: `1px solid ${alpha(isDark ? "#ffffff" : "#000000", 0.1)}`,
    color: "text.primary",
    fontWeight: 500,
  };

  // Base style for filter buttons
  const filterBtnStyle = (isActive) => ({
    borderRadius: "12px",
    px: 1.8,
    py: 0.7,
    textTransform: "none",
    fontSize: "0.85rem",
    letterSpacing: "0.01em",
    transition: "all 0.25s ease",
    ...(isActive ? activeGlass : defaultGlass),
    "&:hover": {
      bgcolor: alpha(accent, 0.08),
      borderColor: alpha(accent, 0.3),
      color: accent,
    },
    "& .MuiButton-endIcon": {
      ml: 0.5,
      "& svg": {
        fontSize: "1.2rem",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  });

  return (
    <Box>
      <Typography
        variant="overline"
        sx={{
          display: "block",
          fontSize: "0.7rem",
          fontWeight: 700,
          color: "text.secondary",
          letterSpacing: "0.06em",
          mb: 1,
          pl: 0.5
        }}
      >
        FILTERS
      </Typography>

      <Box sx={{ display: "flex", gap: { xs: 1.2, sm: 1.5 }, flexWrap: "wrap", alignItems: "center" }}>

        {/* Genre */}
        <Button
          disableElevation
          endIcon={<KeyboardArrowDownRoundedIcon sx={{ transform: anchorElGenre ? "rotate(-180deg)" : "none" }} />}
          onClick={(e) => setAnchorElGenre(e.currentTarget)}
          sx={filterBtnStyle(!!filters.genre)}
        >
          {activeGenreName || "Genre"}
        </Button>
        <Menu {...getMenuProps(anchorElGenre)}>
          <MenuItem selected={!filters.genre} onClick={() => { handleChange("genre", ""); handleClose(); }}>
            All Genres
          </MenuItem>
          {genres.map((g) => (
            <MenuItem key={g.id} selected={String(filters.genre) === String(g.id)} onClick={() => { handleChange("genre", g.id); handleClose(); }}>
              {g.name}
            </MenuItem>
          ))}
        </Menu>

        {/*  Year  */}
        <Button
          disableElevation
          endIcon={<KeyboardArrowDownRoundedIcon sx={{ transform: anchorElYear ? "rotate(-180deg)" : "none" }} />}
          onClick={(e) => setAnchorElYear(e.currentTarget)}
          sx={filterBtnStyle(!!filters.year)}
        >
          {filters.year || "Year"}
        </Button>
        <Menu {...getMenuProps(anchorElYear)}>
          <MenuItem selected={!filters.year} onClick={() => { handleChange("year", ""); handleClose(); }}>
            Any Year
          </MenuItem>
          {years.map((y) => (
            <MenuItem key={y} selected={String(filters.year) === String(y)} onClick={() => { handleChange("year", y); handleClose(); }}>
              {y}
            </MenuItem>
          ))}
        </Menu>

        {/*  Rating  */}
        <Button
          disableElevation
          endIcon={<KeyboardArrowDownRoundedIcon sx={{ transform: anchorElRating ? "rotate(-180deg)" : "none" }} />}
          onClick={(e) => setAnchorElRating(e.currentTarget)}
          sx={filterBtnStyle(!!filters.rating)}
        >
          {filters.rating ? `${filters.rating}.0+` : "Rating"}
        </Button>
        <Menu {...getMenuProps(anchorElRating)}>
          <MenuItem selected={!filters.rating} onClick={() => { handleChange("rating", ""); handleClose(); }}>
            Any Rating
          </MenuItem>
          {ratings.map((r) => (
            <MenuItem key={r} selected={String(filters.rating) === String(r)} onClick={() => { handleChange("rating", r); handleClose(); }}>
              {r}.0+
            </MenuItem>
          ))}
        </Menu>

        {/*  Reset Button  */}
        {hasFilters && (
          <Button
            variant="text"
            onClick={() => setFilters({ genre: "", year: "", rating: "" })}
            startIcon={<ReplayRoundedIcon />}
            sx={{
              ml: { xs: 0, sm: "auto" },
              color: "text.secondary",
              textTransform: "none",
              fontSize: "0.82rem",
              fontWeight: 600,
              borderRadius: "12px",
              px: 2,
              py: 0.7,
              transition: "all 0.2s ease",
              "&:hover": {
                color: accent,
                bgcolor: alpha(accent, 0.08),
                transform: "rotate(-2deg)",
              },
            }}
          >
            Reset
          </Button>
        )}
      </Box>
    </Box>
  );
}
