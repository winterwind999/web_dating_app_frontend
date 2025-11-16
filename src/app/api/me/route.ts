import { getCurrentUserId } from "@/utils/getCurrentUserId";
import { NextResponse } from "next/server";

export async function GET() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ userId });
}
