import { axiosPrivate } from "@/apis/axios";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { useRefreshToken } from "./useRefreshToken";

export const useAxiosPrivate = () => {
  const refresh = useRefreshToken();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        const accessToken = useAuthStore.getState().accessToken;
        const csrfToken = useAuthStore.getState().csrfToken;

        if (accessToken && !config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        if (
          csrfToken &&
          config.method &&
          !["get", "head", "options"].includes(config.method.toLowerCase())
        ) {
          config.headers["x-csrf-token"] = csrfToken;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        const statusCode = error?.response?.status;

        if ((statusCode === 403 || statusCode === 401) && !prevRequest?.sent) {
          prevRequest.sent = true;
          const { accessToken: newAccessToken, csrfToken: newCsrfToken } =
            await refresh();

          if (!newAccessToken || !newCsrfToken) {
            throw new Error("Tokens expired");
          }

          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          prevRequest.headers["x-csrf-token"] = newCsrfToken;

          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [refresh]);

  return axiosPrivate;
};
