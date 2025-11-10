import { BACKEND_URL } from "@/utils/constants";
import { io, Socket } from "socket.io-client";
import { create } from "zustand";

type SocketStore = {
  socket: Socket | null;
  isConnected: boolean;
  socketConnect: (userId: string) => void;
  socketDisconnect: (userId: string) => void;
  socketEmit: (event: string, data: any) => void;
};

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  isConnected: false,

  socketConnect: (userId: string) => {
    const existingSocket = get().socket;

    if (existingSocket?.connected) {
      return;
    }

    console.log("BACKEND_URL", BACKEND_URL);

    const newSocket = io(BACKEND_URL, {
      withCredentials: true,
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
    });

    newSocket.on("connect", () => {
      set({ isConnected: true });
      newSocket.emit("newUser", userId);
    });

    newSocket.on("disconnect", (reason) => {
      set({ isConnected: false });
    });

    newSocket.on("connect_error", (error) => {
      set({ isConnected: false });
    });

    set({ socket: newSocket });
  },

  socketDisconnect: (userId: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit("logout", userId);
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  socketEmit: (event: string, data: any) => {
    const { socket, isConnected } = get();
    if (!socket || !isConnected) {
      return;
    }
    socket.emit(event, data);
  },
}));
