import { BACKEND_URL } from "@/utils/constants";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {},
};

if (typeof fetch !== "undefined") {
  fetch(BACKEND_URL)
    .then(() => console.log("Pre-warmed backend"))
    .catch(() => console.log("Failed to pre-warm backend"));
}

export default nextConfig;
