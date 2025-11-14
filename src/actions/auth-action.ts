"use server";

import { authenticatedFetch } from "@/utils/authenticatedFetch";
import { BACKEND_URL, CSRF_COOKIE } from "@/utils/constants";
import { cookies } from "next/headers";

export async function loginAction(email: string, password: string) {
  const cookieStore = await cookies();
  const csrfToken = cookieStore.get(CSRF_COOKIE)?.value;

  console.log("BACKEND_URL", BACKEND_URL);

  const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": csrfToken || "",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const setCookieHeader = res.headers.get("set-cookie");
  if (setCookieHeader) {
    const cookies = setCookieHeader.split(", ");
    cookies.forEach((cookie) => {
      const [nameValue] = cookie.split(";");
      const [name, value] = nameValue.split("=");
      cookieStore.set(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
    });
  }

  return await res.json();
}

export async function logoutAction() {
  await authenticatedFetch("/auth/logout", {
    method: "POST",
  });

  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete(CSRF_COOKIE);

  return { success: true };
}
