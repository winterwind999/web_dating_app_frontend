import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { BACKEND_URL } from "./utils/constants";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    const accessToken = request.cookies.get("accessToken");
    const refreshToken = request.cookies.get("refreshToken");

    if (!accessToken && refreshToken) {
      const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: "GET",
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
        credentials: "include",
      });

      if (refreshRes.ok) {
        const response = NextResponse.next();
        response.headers.set("Access-Control-Allow-Credentials", "true");
        const setCookieHeaders = refreshRes.headers.getSetCookie();
        setCookieHeaders.forEach((cookie) => {
          response.headers.append("Set-Cookie", cookie);
        });
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/(.*)"],
};
