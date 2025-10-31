import { BACKEND_URL } from "@/utils/constants";
import axios from "axios";

export default axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: BACKEND_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
