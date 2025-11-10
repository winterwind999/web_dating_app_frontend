"use server";

import { authenticatedFetch } from "@/utils/authenticatedFetch";
import { getCurrentUserId } from "@/utils/getCurrentUserId";

export async function createLikeAction(likedUserId: string) {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const res = await authenticatedFetch("/likes", {
    method: "POST",
    body: JSON.stringify({ user: userId, likedUser: likedUserId }),
  });

  return await res.json();
}
