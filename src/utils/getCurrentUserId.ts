import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const decoded = jwtDecode<{ sub: string }>(accessToken);
    return decoded.sub;
  } catch (error) {
    return null;
  }
}
