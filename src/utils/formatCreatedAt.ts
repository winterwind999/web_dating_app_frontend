import { DateTime } from "luxon";

export const formatCreatedAt = (createdAt: string) => {
  if (!createdAt.trim()) {
    return "Invalid Date";
  }

  return DateTime.fromISO(createdAt, { zone: "utc" })
    .setZone("Asia/Manila")
    .toFormat("MMMM dd, yyyy h:mm a");
};
