function getBackendBase() {
  const base =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:9400";
  return base.replace(/\/$/, "");
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
    headers.set(key, value);
  });

  const init = {
    method: request.method,
    headers,
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const response = await fetch(target, init);
  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("content-encoding");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
