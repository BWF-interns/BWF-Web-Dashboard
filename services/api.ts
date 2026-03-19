/**
 * Shared API service — axios instance with JWT auth interceptor.
 * Base URL is read from NEXT_PUBLIC_API_URL environment variable.
 * Automatically redirects to /login on 401 responses.
 */
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach JWT token from localStorage to every outgoing request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login page when token is expired or invalid
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
