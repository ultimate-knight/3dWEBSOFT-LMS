import { getApiBaseURL } from "@/lib/page";

let wakePromise = null;

/**
 * Render free tier: the API container is off until something HTTP-hits it.
 * Backend code cannot run while asleep — only an external request can start it.
 * Call this when the user opens the site (before login).
 */
export function wakeApiBackend() {
  if (typeof window === "undefined") return Promise.resolve();

  if (!wakePromise) {
    const base = getApiBaseURL();
    const url = `${base}/health`;

    wakePromise = fetch(url, { method: "GET", cache: "no-store" })
      .catch(() =>
        fetch(`${base}/hello`, { method: "GET", cache: "no-store" }).catch(
          () => {}
        )
      )
      .finally(() => {
        // Allow a new wake attempt on a later visit in the same tab if needed
        setTimeout(() => {
          wakePromise = null;
        }, 60_000);
      });
  }

  return wakePromise;
}
