"use client";

import { getAllChatsAction } from "@/actions/chats-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useChatStore } from "@/stores/chat-store";
import { useSocketStore } from "@/stores/socket-store";
import { type Chat as ChatType, ChatPayload, User } from "@/utils/constants";
import { ArrowRightIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Chat from "./chat";

type Props = {
  userId: string;
};

export default function Conversation({ userId }: Props) {
  const { socket, socketEmit, isConnected } = useSocketStore();
  const selectedMatch = useChatStore((state) => state.selectedMatch);

  const [chats, setChats] = useState<ChatType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [chat, setChat] = useState<string>("");
  const [isPendingSendChat, setIsPendingSendChat] = useState<boolean>(false);

  const chatsEndRef = useRef<HTMLDivElement>(null);
  const sendTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }
    container.scrollTop = container.scrollHeight;
  };

  const fetchChats = useCallback(
    async (pageToFetch = page, match = selectedMatch) => {
      if (isLoading || !match?._id) {
        return;
      }

      setIsLoading(true);
      const container = scrollContainerRef.current;
      const previousScrollHeight = container?.scrollHeight ?? 0;

      try {
        const { chats: newChats, totalPages: newTotalPages } =
          await getAllChatsAction(match._id, pageToFetch);

        setTotalPages(newTotalPages);
        if (pageToFetch === 1) {
          setChats(newChats);
          setTimeout(scrollToBottom, 100);
        } else {
          setChats((prev) => [...newChats, ...prev]);

          setTimeout(() => {
            if (container) {
              const newScrollHeight = container.scrollHeight;
              container.scrollTop = newScrollHeight - previousScrollHeight;
            }
          }, 50);
        }
      } catch (error) {
        toast.error("Failed to load conversations");
      } finally {
        setIsLoading(false);
      }
    },
    [page, selectedMatch, isLoading],
  );

  useEffect(() => {
    if (selectedMatch?._id) {
      setChats([]);
      setPage(1);
      setTotalPages(1);
      fetchChats(1, selectedMatch);
    } else {
      setChats([]);
      setPage(1);
      setTotalPages(1);
    }
  }, [selectedMatch?._id]);

  useEffect(() => {
    if (page > 1 && selectedMatch?._id) {
      fetchChats(page, selectedMatch);
    }
  }, [page]);

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const handleScroll = () => {
      if (isLoading || page >= totalPages) {
        return;
      }

      if (container.scrollTop <= 100) {
        setPage((prev) => prev + 1);
      }
    };

    container?.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, page, totalPages]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const onReceiveChat = (payload: any) => {
      if (sendTimeoutRef.current) {
        clearTimeout(sendTimeoutRef.current);
        sendTimeoutRef.current = null;
      }

      if (payload?.isError) {
        toast.error(payload.errorMessage || "Failed to send message");
        setIsPendingSendChat(false);
        return;
      }

      if (payload?.chat) {
        setChats((prev) => [...prev, payload.chat]);
        setChat("");
        setTimeout(() => {
          scrollToBottom();
          textareaRef.current?.focus();
        }, 100);
      }

      setIsPendingSendChat(false);
    };

    socket.on("receiveChat", onReceiveChat);

    return () => {
      socket.off("receiveChat");
      if (sendTimeoutRef.current) {
        clearTimeout(sendTimeoutRef.current);
      }
    };
  }, [socket]);

  const onSendChat = () => {
    if (isPendingSendChat || !selectedMatch?._id || !chat.trim()) {
      return;
    }

    if (!isConnected) {
      toast.error("Not connected to chat server. Please refresh the page.");
      return;
    }

    setIsPendingSendChat(true);

    const user = selectedMatch.user as User;
    const matchedUser = selectedMatch.matchedUser as User;

    const senderUserId = userId;
    const receiverUserId = userId === user._id ? matchedUser._id : user._id;

    const payload: ChatPayload = {
      match: selectedMatch._id,
      senderUser: senderUserId,
      receiverUser: receiverUserId,
      content: chat.trim(),
      type: "text",
      status: "Sending",
    };

    socketEmit("sendChat", payload);

    sendTimeoutRef.current = setTimeout(() => {
      setIsPendingSendChat(false);
      toast.error("Failed to send message. Please try again.");
    }, 10000);
  };

  if (!selectedMatch) {
    return (
      <Card className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">
          Select a match to start chatting
        </p>
      </Card>
    );
  }

  return (
    <Card className="flex h-screen min-h-0 flex-col">
      <CardContent
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4"
      >
        {!isConnected && (
          <div className="bg-destructive/10 text-destructive mb-2 rounded p-2 text-center text-sm">
            Disconnected from chat server. Reconnecting...
          </div>
        )}
        {isLoading && chats.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <Spinner />
          </div>
        ) : chats.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {chats.map((chat) => (
              <Chat key={chat._id} chat={chat} userId={userId} />
            ))}
            <div ref={chatsEndRef} />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4">
        <div className="flex w-full items-center gap-3">
          <Textarea
            ref={textareaRef}
            value={chat}
            onChange={(e) => setChat(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSendChat();
              }
            }}
            className="resize-none"
            rows={1}
            placeholder="Type a message..."
            disabled={isPendingSendChat || !isConnected}
          />

          <Button
            type="button"
            variant="default"
            onClick={onSendChat}
            disabled={isPendingSendChat || !chat.trim() || !isConnected}
          >
            {isPendingSendChat ? <Spinner /> : <ArrowRightIcon />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
