"use server";

import { authenticatedFetch } from "@/utils/authenticatedFetch";
import { CreateBlockDto } from "@/utils/constants";
import { getCurrentUserId } from "@/utils/getCurrentUserId";

export async function createBlockAction(
  createBlockDto: Omit<CreateBlockDto, "user">,
) {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const newCreateBlockDto: CreateBlockDto = {
    ...createBlockDto,
    user: userId,
  };

  const res = await authenticatedFetch("/blocks", {
    method: "POST",
    body: JSON.stringify(newCreateBlockDto),
  });

  return await res.json();
}
