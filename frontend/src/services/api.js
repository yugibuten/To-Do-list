import axios from "axios";

import { API_BASE_URL } from "../constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export const fetchTasks = async ({ status = "all", category, search, sortBy, sortDir }) => {
  const params = { status };
  if (category) params.category = category;
  if (search) params.search = search;
  if (sortBy) params.sort_by = sortBy;
  if (sortDir) params.sort_dir = sortDir;
  const response = await api.get("/tasks", { params });
  return response.data;
};

export const fetchTaskStats = async () => {
  const response = await api.get("/tasks/stats");
  return response.data;
};

export const createTask = async (payload) => {
  const response = await api.post("/tasks", payload);
  return response.data;
};

export const updateTask = async (id, payload) => {
  const response = await api.put(`/tasks/${id}`, payload);
  return response.data;
};

export const toggleTask = async (id) => {
  const response = await api.patch(`/tasks/${id}/toggle`);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export default api;
