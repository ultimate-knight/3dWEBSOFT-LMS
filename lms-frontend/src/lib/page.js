import axios from "axios";

function normalizeBase(url) {
  return (url || "").replace(/\/$/, "");
}

function getDirectBackendURL() {
  const base =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:9400";
  return normalizeBase(base);
}

function isLoopbackUrl(url) {
  return /localhost|127\.0\.0\.1/i.test(url || "");
}

function isLocalDevHost(hostname) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]"
  );
}

export function looksLikeHtmlErrorBody(value) {
  if (typeof value !== "string") return false;
  const sample = value.trim().slice(0, 800).toLowerCase();
  return (
    sample.startsWith("<!doctype") ||
    sample.startsWith("<html") ||
    sample.includes("<title>502") ||
    sample.includes("<title>503") ||
    sample.includes("<title>504") ||
    sample.includes("bad gateway")
  );
}

function gatewayErrorMessage(status) {
  if (status === 502 || status === 503 || status === 504) {
    return (
      "The API is waking up or temporarily unreachable (502/503). " +
      "On Render free tier this can take 30–60 seconds — wait and try again."
    );
  }
  return `Server error (${status || "unknown"}). Check backend deployment and env vars.`;
}

/**
 * Local dev: browser → `/api/*` → Next route handler → Express on :9400.
 * Production: browser → public backend URL (direct; avoids serverless /api timeouts).
 */
export function getApiBaseURL() {
  if (typeof window !== "undefined") {
    const configured = normalizeBase(process.env.NEXT_PUBLIC_API_URL);

    if (configured && !isLoopbackUrl(configured)) {
      return configured;
    }

    if (isLocalDevHost(window.location.hostname)) {
      return "/api";
    }

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error?.response?.data;
    const status = error?.response?.status;

    if (typeof data === "string" && looksLikeHtmlErrorBody(data)) {
      error.response.data = {
        message: gatewayErrorMessage(status),
        hint:
          "Set NEXT_PUBLIC_API_URL to your live API (e.g. https://threedwebsoft-lms-4.onrender.com) and redeploy the frontend.",
      };
    }

    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error, fallback = "Request failed") {
  const status = error?.response?.status;
  const data = error?.response?.data;

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const message = data.message || data.error || data.hint;
    if (message && typeof message === "string") return message;
  }

  if (typeof data === "string") {
    if (looksLikeHtmlErrorBody(data)) {
      return gatewayErrorMessage(status);
    }
    if (data.length < 300) return data;
    return gatewayErrorMessage(status);
  }

  if (!error?.response) {
    return "Cannot reach API. Check network and backend URL.";
  }

  if (status === 502 || status === 503 || status === 504) {
    const hint = data?.hint;
    if (hint) return hint;
    return gatewayErrorMessage(status);
  }

  return fallback;
}

function shouldRetryGatewayError(error) {
  const status = error?.response?.status;
  if (status === 502 || status === 503 || status === 504) return true;
  return looksLikeHtmlErrorBody(error?.response?.data);
}

/**
 * Retries POST on cold-start / gateway failures (common on Render free tier).
 */
export async function apiPostWithRetry(
  path,
  body,
  { retries = 2, delayMs = 12000 } = {}
) {
  const { wakeApiBackend } = await import("@/lib/wakeApi");
  await wakeApiBackend();

  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await api.post(path, body);
    } catch (error) {
      lastError = error;
      if (!shouldRetryGatewayError(error) || attempt === retries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}

export default api;
