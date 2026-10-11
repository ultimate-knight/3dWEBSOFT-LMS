import api from "@/lib/page";

export function getApiErrorMessage(error, fallback = "Request failed") {
  const data = error?.response?.data;
  if (data && typeof data === "object") {
    const message = data.message || data.error;
    if (typeof message === "string") return message;
  }
  if (typeof data === "string" && data.length < 300) return data;
  if (!error?.response) {
    return "Cannot reach API. Check network and backend URL.";
  }
  return fallback;
}

export async function apiPostWithRetry(
  path,
  body,
  { retries = 2, delayMs = 12000 } = {}
) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await api.post(path, body);
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;
      if (!(status === 502 || status === 503 || status === 504) || attempt === retries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
}
