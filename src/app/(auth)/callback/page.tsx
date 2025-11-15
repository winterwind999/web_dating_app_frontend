"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const csrfToken = searchParams.get("csrfToken");

    if (accessToken && refreshToken && csrfToken) {
      const isProduction = process.env.NODE_ENV === "production";
      const cookieOptions = `path=/; max-age=${7 * 24 * 60 * 60}; ${
        isProduction ? "secure; samesite=strict" : "samesite=lax"
      }`;

      document.cookie = `accessToken=${accessToken}; ${cookieOptions}`;
      document.cookie = `refreshToken=${refreshToken}; ${cookieOptions}`;
      document.cookie = `csrfToken=${csrfToken}; ${cookieOptions}`;

      window.history.replaceState({}, document.title, "/feeds");

      router.push("/feeds");
    } else {
      console.error("Missing tokens in callback");
      router.push("/login");
    }
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Completing sign in...</p>
    </div>
  );
}
