import { AxiosError } from "axios";

interface Props {
  error: ApiErrorType;
}

const catchError = ({ error }: Props) => {
  let message = "";

  if (error instanceof AxiosError) {
    message = error.response?.data?.response;
  }

  if (Array.isArray(error.response?.data?.response?.message)) {
    message = error.response?.data?.response?.message.join(", ");
  }

  if (error.message === "Tokens expired") {
    window.location.href = "/token-expired";
    return;
  }

  throw new Error(message || "Internal Server Error");
};
export default catchError;
