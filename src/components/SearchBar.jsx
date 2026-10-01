import { TextField, InputAdornment, alpha, useTheme } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

export default function SearchBar({ value, onChange }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accent = isDark ? "#a78bfa" : "#6c63ff";

  return (
    <TextField
      fullWidth
      placeholder="Search for movies, shows, actors..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchRoundedIcon
              sx={{
                color: alpha(accent, 0.6),
                fontSize: 22,
                transition: "color 0.25s ease",
              }}
            />
          </InputAdornment>
        ),
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "16px",
          background: isDark
            ? alpha("#ffffff", 0.04)
            : alpha("#000000", 0.03),
          backdropFilter: "blur(12px)",
          transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
          fontSize: "0.95rem",
          "& fieldset": {
            borderColor: alpha(isDark ? "#ffffff" : "#000000", 0.1),
            transition: "border-color 0.3s ease",
          },
          "&:hover fieldset": {
            borderColor: alpha(accent, 0.4),
          },
          "&.Mui-focused": {
            background: isDark
              ? alpha("#ffffff", 0.06)
              : alpha("#ffffff", 0.9),
            boxShadow: `0 0 0 3px ${alpha(accent, 0.15)}, 0 8px 24px ${alpha(accent, 0.08)}`,
          },
          "&.Mui-focused fieldset": {
            borderColor: accent,
            borderWidth: "1.5px",
          },
          "&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root": {
            color: accent,
          },
        },
        "& .MuiOutlinedInput-input": {
          py: 1.6,
          "&::placeholder": {
            color: alpha(isDark ? "#ffffff" : "#000000", 0.4),
            opacity: 1,
          },
        },
      }}
    />
  );
}