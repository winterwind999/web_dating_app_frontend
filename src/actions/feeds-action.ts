"use server";

import { authenticatedFetch } from "@/utils/authenticatedFetch";
import { getCurrentUserId } from "@/utils/getCurrentUserId";
import { cache } from "react";

export const getFeedsAction = cache(async () => {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const res = await authenticatedFetch(`/feeds/${userId}`, {
    method: "GET",
  });

  return await res.json();
});
