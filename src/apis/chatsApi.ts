import catchError from "@/utils/catchError";
import type { AxiosInstance } from "axios";

export const getAllChatsApi = async (
  axiosPrivate: AxiosInstance,
  userId: string,
) => {
  try {
    const res = await axiosPrivate.get(`/api/chats/${userId}`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    catchError({ error: err as any });
  }
};

export const getConversationMessagesApi = async (
  axiosPrivate: AxiosInstance,
  userId: string,
  receiverId: string,
  page = 1,
  limit = 20,
) => {
  try {
    const res = await axiosPrivate.get(`/api/chats/${userId}/${receiverId}`, {
      params: { page, limit },
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    catchError({ error: err as any });
  }
};

export const sendMessageApi = async (
  axiosPrivate: AxiosInstance,
  payload: {
    conversationId: string;
    sender: string;
    content?: string;
    type?: string;
  },
) => {
  try {
    const res = await axiosPrivate.post(`/api/chats/message`, payload, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    catchError({ error: err as any });
  }
};
