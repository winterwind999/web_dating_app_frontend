import { BACKEND_URL } from "@/utils/constants";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  webpack(config, { isServer }) {
    if (isServer) {
      // When the Next.js server is starting (cold start), ping backend
      fetch(BACKEND_URL)
        .then(() => console.log("Pre-warmed backend"))
        .catch(() => console.log("Failed to pre-warm backend"));
    }
    return config;
  },
};

export default nextConfig;
