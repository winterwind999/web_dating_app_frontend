"use server";

import { authenticatedFetch } from "@/utils/authenticatedFetch";
import { BACKEND_URL, CSRF_COOKIE } from "@/utils/constants";
import { cookies } from "next/headers";

export async function loginAction(email: string, password: string) {
  const cookieStore = await cookies();
  const csrfToken = cookieStore.get(CSRF_COOKIE)?.value;

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

export async function verifyEmailAction(email: string) {
  const res = await fetch(
    `${BACKEND_URL}/api/auth/forgot-password/verify-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    },
  );

  return await res.json();
}

export async function verifyOtpAction(email: string, otp: string) {
  const res = await fetch(
    `${BACKEND_URL}/api/auth/forgot-password/verify-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    },
  );

  return await res.json();
}

export async function changePasswordAction(email: string, password: string) {
  const res = await fetch(
    `${BACKEND_URL}/api/auth/forgot-password/change-password`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    },
  );

  return await res.json();
}
