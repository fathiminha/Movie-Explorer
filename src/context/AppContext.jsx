import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

function useLocal(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved === null ? initial : JSON.parse(saved);
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

export function AppProvider({ children }) {
  const [user, setUser] = useLocal("me_user", null);
  const [mode, setMode] = useLocal("me_mode", "light");
  const [favorites, setFavorites] = useLocal("me_favorites", []);
  const [lastSearch, setLastSearch] = useLocal("me_lastSearch", "");

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  const toggleMode = () => setMode((m) => (m === "light" ? "dark" : "light"));
  const isFavorite = (id) => favorites.some((m) => m.id === id);
  const toggleFavorite = (movie) => {
    const small = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    };
    setFavorites((f) => (f.some((m) => m.id === movie.id) ? f.filter((m) => m.id !== movie.id) : [...f, small]));
  };

  const value = {
    user, login: setUser, logout: () => setUser(null),
    mode, toggleMode,
    favorites, isFavorite, toggleFavorite,
    lastSearch, setLastSearch,
  };

  return (
    <AppContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppContext.Provider>
  );
}