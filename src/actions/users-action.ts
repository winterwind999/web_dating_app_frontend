"use server";

import { authenticatedFetch } from "@/utils/authenticatedFetch";
import {
  BACKEND_URL,
  CSRF_COOKIE,
  type CreateUserDto,
  type UpdateUserDto,
} from "@/utils/constants";
import { getCurrentUserId } from "@/utils/getCurrentUserId";
import { cookies } from "next/headers";

export async function getUserAction() {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const res = await authenticatedFetch(`/users/${userId}`, {
    method: "GET",
  });

  return await res.json();
}

export async function createUserAction(createUserDto: CreateUserDto) {
  const cookieStore = await cookies();
  const csrfToken = cookieStore.get(CSRF_COOKIE)?.value;

  const res = await fetch(`${BACKEND_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": csrfToken || "",
    },
    credentials: "include",
    body: JSON.stringify(createUserDto),
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

export async function updateUserAction(updateUserDto: UpdateUserDto) {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const res = await authenticatedFetch(`/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(updateUserDto),
  });

  return await res.json();
}

export async function uploadPhotoAction(formData: FormData) {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const res = await authenticatedFetch(
    `/users/uploadPhoto/${userId}`,
    {
      method: "PATCH",
      body: formData,
    },
    true,
  );

  return await res.json();
}

export async function uploadAlbumsAction(formData: FormData) {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const res = await authenticatedFetch(
    `/users/uploadAlbums/${userId}`,
    {
      method: "PATCH",
      body: formData,
    },
    true,
  );

  return await res.json();
}
