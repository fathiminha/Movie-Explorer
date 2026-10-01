import axios from "axios";

export const IMG = "https://image.tmdb.org/t/p/w500";

const api = axios.create({ baseURL: "https://api.themoviedb.org/3" });

// Adds the API key to every request.
api.interceptors.request.use((config) => {
  config.params = { ...config.params, api_key: process.env.REACT_APP_TMDB_API_KEY };
  return config;
});

export const getTrending = (page = 1) =>
  api.get("/trending/movie/week", { params: { page } }).then((r) => r.data);

// Fetch movie genres
export const getGenres = () =>
  api.get("/genre/movie/list").then((r) => r.data.genres);

// Discover movies with filters (year, genre, rating)
export const discoverMovies = (filters, page = 1) =>
  api.get("/discover/movie", { 
    params: { 
      ...filters, 
      page, 
      sort_by: "popularity.desc", 
      "vote_count.gte": 50 
    } 
  }).then((r) => r.data);

export const searchMovies = (query, page = 1) =>
  api.get("/search/movie", { params: { query, page } }).then((r) => r.data);

export const getMovie = (id) =>
  api.get(`/movie/${id}`, { params: { append_to_response: "credits,videos" } }).then((r) => r.data);

// Turns an axios error into a friendly message.
export function errorMessage(e) {
  if (e.response?.status === 401) return "Invalid TMDb API key. Check the REACT_APP_TMDB_API_KEY value in your .env file.";
  if (e.response?.status === 404) return "We couldn't find that movie.";
  if (e.response) return `TMDb returned an error (${e.response.status}). Please try again.`;
  return "Network error. Check your internet connection and try again.";
}