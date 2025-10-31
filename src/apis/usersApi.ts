import catchError from "@/utils/catchError";
import type { AxiosInstance } from "axios";
import axios from "./axios";

export const getUserApi = async (
  axiosPrivate: AxiosInstance,
  userId: string,
) => {
  try {
    const response = await axiosPrivate.get(`/api/users/${userId}`, {
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

export const createUserApi = async (createUserDto: CreateUserDto) => {
  try {
    const response = await axios.post(`/api/users`, createUserDto, {
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

export const updateUserApi = async (
  axiosPrivate: AxiosInstance,
  userId: string,
  updateUserDto: UpdateUserDto,
) => {
  try {
    const response = await axiosPrivate.patch(
      `/api/users/${userId}`,
      updateUserDto,
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
