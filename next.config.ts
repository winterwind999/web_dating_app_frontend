import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {},
};

if (typeof fetch !== "undefined") {
  fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://matchy-api-h0c4.onrender.com",
  )
    .then(() => console.log("Pre-warmed backend"))
    .catch(() => console.log("Failed to pre-warm backend"));
}

export default nextConfig;
