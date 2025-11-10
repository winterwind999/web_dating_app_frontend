"use server";

import { authenticatedFetch } from "@/utils/authenticatedFetch";
import { getCurrentUserId } from "@/utils/getCurrentUserId";

export async function getAllChatsAction(matchId: string, page: number) {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const res = await authenticatedFetch(`/chats/${matchId}?page=${page}`, {
    method: "GET",
  });

  return await res.json();
}
