import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["localhost", "192.168.1.3"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
