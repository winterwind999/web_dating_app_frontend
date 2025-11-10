"use server";

import { authenticatedFetch } from "@/utils/authenticatedFetch";
import { getCurrentUserId } from "@/utils/getCurrentUserId";

export async function getAllMatchesAction(page: number, search: string) {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const res = await authenticatedFetch(
    `/matches/${userId}?page=${page}&search=${encodeURIComponent(search)}`,
    {
      method: "GET",
    },
  );

  return await res.json();
}
