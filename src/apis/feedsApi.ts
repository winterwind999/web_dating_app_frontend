import catchError from "@/utils/catchError";
import type { AxiosInstance } from "axios";

export const getFeedsApi = async (
  axiosPrivate: AxiosInstance,
  userId: string,
) => {
  try {
    const response = await axiosPrivate.get(`/api/feeds/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (err) {
    const error = err as ApiErrorType;
    catchError({ error });
  }
};
