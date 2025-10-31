import catchError from "@/utils/catchError";
import type { AxiosInstance } from "axios";
import axios from "./axios";

export const loginApi = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(
      "/api/auth/login",
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (err) {
    const error = err as ApiErrorType;
    catchError({ error });
  }
};

export const healthCheckApi = async () => {
  try {
    const response = await axios.get("api/auth/health-check", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (err) {
    const error = err as ApiErrorType;
    catchError({ error });
  }
};

export const logoutApi = async (axiosPrivate: AxiosInstance) => {
  try {
    const response = await axiosPrivate.post(
      "api/auth/logout",
      {},
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

export const forgotPasswordVerifyEmailApi = async (email: string) => {
  try {
    const response = await axios.post(
      "api/auth/forgot-password/verify-email",
      { email },
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

export const forgotPasswordVerifyOtpApi = async (
  email: string,
  otp: string,
) => {
  try {
    const response = await axios.post(
      "api/auth/forgot-password/verify-otp",
      { email, otp },
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

export const forgotPasswordChangePasswordApi = async (
  email: string,
  password: string,
) => {
  try {
    const response = await axios.patch(
      "api/auth/forgot-password/change-password",
      { email, password },
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
