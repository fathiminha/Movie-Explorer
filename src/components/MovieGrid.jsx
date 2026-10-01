import { Grid } from "@mui/material";
import MovieCard from "./MovieCard";

export default function MovieGrid({ movies }) {
  return (
    <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
      {movies.map((m, i) => (
        <Grid item xs={6} sm={4} md={3} lg={2} key={m.id}>
          <MovieCard movie={m} index={i} />
        </Grid>
      ))}
    </Grid>
  );
}