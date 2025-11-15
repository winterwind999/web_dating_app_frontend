import { getCurrentUserId } from "@/utils/getCurrentUserId";
import { NextResponse } from "next/server";

export async function GET() {
  const userId = await getCurrentUserId();

  console.log("route userId", userId);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" });
  }

  return NextResponse.json({ userId });
}
