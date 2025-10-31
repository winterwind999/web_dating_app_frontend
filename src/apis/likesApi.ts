import catchError from "@/utils/catchError";
import type { AxiosInstance } from "axios";

export const createLikeApi = async (
  axiosPrivate: AxiosInstance,
  createLikeDto: CreateLikeDto,
) => {
  try {
    const response = await axiosPrivate.post(`/api/likes`, createLikeDto, {
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
