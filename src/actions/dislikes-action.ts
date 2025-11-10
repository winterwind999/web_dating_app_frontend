"use server";

import { authenticatedFetch } from "@/utils/authenticatedFetch";
import { getCurrentUserId } from "@/utils/getCurrentUserId";

export async function createDislikeAction(dislikedUserId: string) {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const res = await authenticatedFetch("/dislikes", {
    method: "POST",
    body: JSON.stringify({ user: userId, dislikedUser: dislikedUserId }),
  });

  return await res.json();
}
