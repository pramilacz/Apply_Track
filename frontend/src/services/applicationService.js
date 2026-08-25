import api from "./api";

export const applicationService = {
  async list() {
    const { data } = await api.get("/applications");
    return data.applications;
  },

  async get(id) {
    const { data } = await api.get(`/applications/${id}`);
    return data.application;
  },

  async create(payload) {
    const { data } = await api.post("/applications", payload);
    return data.application;
  },

  async update(id, payload) {
    const { data } = await api.put(`/applications/${id}`, payload);
    return data.application;
  },

  async remove(id) {
    await api.delete(`/applications/${id}`);
  },
};
