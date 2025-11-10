"use client";

import { useSocketStore } from "@/stores/socket-store";
import { useEffect } from "react";

type Props = {
  userId: string;
  children: React.ReactNode;
};

export default function SocketClient({ userId, children }: Props) {
  const { socketConnect, socketDisconnect } = useSocketStore();

  useEffect(() => {
    socketConnect(userId);
    return () => {
      socketDisconnect(userId);
    };
  }, [userId, socketConnect, socketDisconnect]);

  return <>{children}</>;
}
