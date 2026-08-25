import api from "./api";

export const authService = {
  async me() {
    const { data } = await api.get("/auth/me");
    return data.user;
  },

  async login(username, password) {
    const { data } = await api.post("/auth/login", { username, password });
    return data.user;
  },

  async register(username, password) {
    const { data } = await api.post("/auth/register", { username, password });
    return data.user;
  },

  async logout() {
    await api.post("/auth/logout");
  },

  googleLoginUrl() {
    const baseURL = import.meta.env.VITE_API_URL || "/api";
    return `${baseURL}/auth/google/login`;
  },
};
