import { useAuthStore } from "@/stores/authStore";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (accessToken) {
    const decoded: {
      sub: string;
    } = jwtDecode(accessToken);

    return {
      sub: decoded.sub,
    };
  }

  return { sub: "" };
};
