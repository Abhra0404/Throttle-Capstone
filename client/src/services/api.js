
import axios from "axios";

export const AUTH_STORAGE_KEY = "throttle-auth-session";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    const session = saved ? JSON.parse(saved) : null;

    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }
  } catch {
    // Authentication errors are handled by the API response interceptor.
  }

  return config;
});

// Attach JWT automatically to protected requests.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";

    const isAuthRequest =
      url.includes("/auth/login") ||
      url.includes("/auth/register");

    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      window.dispatchEvent(new Event("throttle:unauthorized"));
    }

    return Promise.reject(error);
  }
);

// Handle expired or invalid authentication sessions.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      window.dispatchEvent(new Event("throttle:unauthorized"));
    }

    return Promise.reject(error);
  }
);

export default api;
