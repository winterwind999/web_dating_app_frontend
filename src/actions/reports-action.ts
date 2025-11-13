"use server";

import { authenticatedFetch } from "@/utils/authenticatedFetch";
import { CreateReportDto } from "@/utils/constants";
import { getCurrentUserId } from "@/utils/getCurrentUserId";

export async function createReportAction(
  createReportDto: Omit<CreateReportDto, "user">,
) {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const newCreateReportDto: CreateReportDto = {
    ...createReportDto,
    user: userId,
  };

  const res = await authenticatedFetch("/reports", {
    method: "POST",
    body: JSON.stringify(newCreateReportDto),
  });

  return await res.json();
}
