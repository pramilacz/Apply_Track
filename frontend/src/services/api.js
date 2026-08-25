import axios from "axios";

// In production (Vercel) both the React app and the Flask API are served
// from the same project, so /api is same-origin. In local dev, Vite's
// proxy (see vite.config.js) forwards /api to the Flask dev server.
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
