import catchError from "@/utils/catchError";
import type { AxiosInstance } from "axios";

export const createDislikeApi = async (
  axiosPrivate: AxiosInstance,
  createDislikeDto: CreateDislikeDto,
) => {
  try {
    const response = await axiosPrivate.post(
      `/api/dislikes`,
      createDislikeDto,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );

    return response.data;
  } catch (err) {
    const error = err as ApiErrorType;
    catchError({ error });
  }
};
