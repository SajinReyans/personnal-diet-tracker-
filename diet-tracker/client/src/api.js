import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export const sendLog = (text) => api.post("/log", { text }).then((r) => r.data);
export const getEntries = (date) => api.get("/entries", { params: { date } }).then((r) => r.data);
export const deleteEntryApi = (id) => api.delete(`/entries/${id}`).then((r) => r.data);
export const getSummary = (date) => api.get("/summary", { params: { date } }).then((r) => r.data);
export const getGoal = () => api.get("/goal").then((r) => r.data);
export const setGoal = (goal) => api.post("/goal", goal).then((r) => r.data);

export default api;
