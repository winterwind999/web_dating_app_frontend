"use server";

import { authenticatedFetch } from "@/utils/authenticatedFetch";
import {
  BACKEND_URL,
  type CreateUserDto,
  type UpdateUserDto,
} from "@/utils/constants";
import { getCurrentUserId } from "@/utils/getCurrentUserId";

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
  const res = await fetch(`${BACKEND_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createUserDto),
  });

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
