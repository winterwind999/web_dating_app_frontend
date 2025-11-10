"use server";

import { authenticatedFetch } from "@/utils/authenticatedFetch";
import { getCurrentUserId } from "@/utils/getCurrentUserId";

export async function getAllNotificationsAction(page: number) {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const res = await authenticatedFetch(
    `/notifications/${userId}?page=${page}`,
    {
      method: "GET",
    },
  );

  return await res.json();
}

export async function updateNotificationsAction() {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const res = await authenticatedFetch(`/notifications/${userId}`, {
    method: "PATCH",
  });

  return await res.json();
}
