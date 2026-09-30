import { TextField } from "@mui/material";

export default function SearchBar({ value, onChange }) {
  return (
    <TextField
      fullWidth
      label="Search movies"
      placeholder="Type a movie name…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}