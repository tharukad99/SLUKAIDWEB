// src/apiClient.js
import axios from "axios";

const api = axios.create({
  // baseURL: "https://localhost:7257/api/", // 👈 your .NET API base
  baseURL: "https://slukaidbackend-baghd3apcsggfagr.canadacentral-01.azurewebsites.net/api/", // 👈 your .NET API base
});

// Add JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
