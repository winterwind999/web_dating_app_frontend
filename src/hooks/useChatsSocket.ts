import { BACKEND_URL } from "@/utils/constants";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  _id: string;
  conversationId: string;
  sender: any;
  content: string;
  type: string;
  createdAt: string;
  seenAt?: string;
}

interface UseChatsSocketOptions {
  userId: string;
  onNewMessage?: (message: Message) => void;
  onMessageSent?: (message: Message) => void;
  onMessageSeen?: (payload: any) => void;
}

export const useChatsSocket = ({
  userId,
  onNewMessage,
  onMessageSent,
  onMessageSeen,
}: UseChatsSocketOptions) => {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const socket = io(`${BACKEND_URL}/api/chats`, {
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join", { userId });
      setConnected(true);
    });

    socket.on("message:new", (data) => onNewMessage?.(data.message));
    socket.on("message:sent", (data) => onMessageSent?.(data.message));
    socket.on("message:seen", (data) => onMessageSeen?.(data));

    return () => {
      socket.emit("leave", { userId });
      socket.disconnect();
    };
  }, [userId]);

  const sendMessage = (payload: {
    conversationId: string;
    sender: string;
    content?: string;
    type?: string;
  }) => {
    socketRef.current?.emit("sendMessage", payload);
  };

  const markSeen = (conversationId: string, messageId: string) => {
    socketRef.current?.emit("markSeen", { conversationId, messageId, userId });
  };

  return { connected, sendMessage, markSeen };
};
