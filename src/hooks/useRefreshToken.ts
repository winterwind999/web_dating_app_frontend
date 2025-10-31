import axios from "@/apis/axios";
import { useAuthStore } from "@/stores/authStore";

export const useRefreshToken = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setCsrfToken = useAuthStore((state) => state.setCsrfToken);

  const refresh = async (): Promise<{
    accessToken: string | null;
    csrfToken: string | null;
  }> => {
    try {
      const response = await axios.get("/api/auth/refresh", {
        withCredentials: true,
      });

      const { accessToken, csrfToken } = response.data;

      setAccessToken(accessToken);
      setCsrfToken(csrfToken);
      return {
        accessToken,
        csrfToken,
      };
    } catch (error) {
      setAccessToken(null);
      setCsrfToken(null);
      return {
        accessToken: null,
        csrfToken: null,
      };
    }
  };

  return refresh;
};
