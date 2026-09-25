function getBackendBase() {
  const base =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:9400";

  let normalized = base.replace(/\/$/, "");

  // Next.js runs the proxy on the server — use IPv4 loopback locally.
  if (normalized.includes("://localhost")) {
    normalized = normalized.replace("://localhost", "://127.0.0.1");
  }

  return normalized;
}

async function proxy(request, context) {
  const { path } = await context.params;
  const segments = Array.isArray(path) ? path : [];
  const pathStr = segments.map(encodeURIComponent).join("/");
  const incoming = new URL(request.url);
  const target = `${getBackendBase()}/${pathStr}${incoming.search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() === "host") return;
    if (key.toLowerCase() === "connection") return;
    headers.set(key, value);
  });

  const init = {
    method: request.method,
    headers,
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  try {
    const response = await fetch(target, init);
    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("content-encoding");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[api proxy] failed:", target, error?.message || error);

    const isLocalBackend =
      getBackendBase().includes("127.0.0.1") ||
      getBackendBase().includes("localhost");

    return Response.json(
      {
        message: "Cannot reach the LMS backend.",
        error: error?.message || "fetch failed",
        hint: isLocalBackend
          ? "In lms-backend run: node server.js (port 9400). Keep it running while using the app."
          : "Set API_URL on the frontend host to your public backend URL (not localhost).",
        proxyTarget: target,
      },
      { status: 503 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
