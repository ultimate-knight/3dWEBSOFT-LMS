import axios from "axios";

function getDirectBackendURL() {
  const base =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:9400";
  return base.replace(/\/$/, "");
}

/**
 * Browser calls same-origin `/api/...` (Next route handler → Express).
 * Postman hits `http://localhost:9400/...` directly — same backend, different URL.
 */
export function getApiBaseURL() {
  if (typeof window !== "undefined") {
    return "/api";
  }
  return getDirectBackendURL();
}

const api = axios.create();

api.interceptors.request.use((config) => {
  config.baseURL = getApiBaseURL();

  const token = localStorage.getItem("token");
  const path = config.url || "";
  const isAuthRoute =
    path.includes("/login") ||
    path.includes("/register") ||
    path.includes("/adminlogin") ||
    path.includes("/adminregister");

  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function getApiErrorMessage(error, fallback = "Request failed") {
  const data = error?.response?.data;
  const message =
    data?.message ||
    data?.error ||
    (typeof data === "string" ? data : null);

  if (message) return message;

  if (!error?.response) {
    return "Cannot reach API. Start the backend (port 9400) and restart `npm run dev` in lms-frontend.";
  }

  if (error.response.status === 502 || error.response.status === 503) {
    const hint = error.response.data?.hint;
    if (hint) return hint;
    return "Backend unreachable (502/503). Run `node server.js` in lms-backend.";
  }

  return fallback;
}

export default api;
