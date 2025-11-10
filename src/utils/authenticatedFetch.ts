"use server";

import { BACKEND_URL, CSRF_COOKIE } from "@/utils/constants";
import { cookies } from "next/headers";

export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {},
  isFormData: boolean = false,
) {
  const cookieStore = await cookies();
  const csrfToken = cookieStore.get(CSRF_COOKIE)?.value;
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const cookieParts = [];
  if (accessToken) {
    cookieParts.push(`accessToken=${accessToken}`);
  }
  if (refreshToken) {
    cookieParts.push(`refreshToken=${refreshToken}`);
  }
  if (csrfToken) {
    cookieParts.push(`${CSRF_COOKIE}=${csrfToken}`);
  }

  const headers: Record<string, string> = {
    "x-csrf-token": csrfToken || "",
    Cookie: cookieParts.join("; "),
    ...(options.headers as Record<string, string>),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(`${BACKEND_URL}/api${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });
}
