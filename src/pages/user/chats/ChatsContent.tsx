import { getConversationMessagesApi } from "@/apis/chatsApi";
import { useAuth } from "@/hooks/useAuth";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { useChatsSocket } from "@/hooks/useChatsSocket";
import { useEffect, useState } from "react";

interface Conversation {
  conversationId: string;
  other: any;
  lastMessage?: any;
  unreadCount: number;
}

interface Message {
  _id: string;
  sender: any;
  content: string;
  type: string;
  createdAt: string;
  seenAt?: string;
}

interface ChatsContentProps {
  conversations: Conversation[];
}

const ChatsContent = ({ conversations }: ChatsContentProps) => {
  const axiosPrivate = useAxiosPrivate();
  const { sub } = useAuth();

  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);

  const { sendMessage, markSeen } = useChatsSocket({
    userId: sub,
    onNewMessage: (msg) => {
      if (selectedConv?.conversationId === msg.conversationId) {
        setMessages((prev) => [...prev, msg]);
        markSeen(msg.conversationId, msg._id);
      }
    },
    onMessageSent: (msg) => {
      if (selectedConv?.conversationId === msg.conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    },
  });

  useEffect(() => {
    if (!selectedConv) return;
    const loadMessages = async () => {
      const res = await getConversationMessagesApi(
        axiosPrivate,
        sub,
        selectedConv.other._id,
        page,
      );
      setMessages(res.messages);
    };
    loadMessages();
  }, [selectedConv, page, axiosPrivate, sub]);

  const handleSendMessage = (content: string) => {
    if (!selectedConv) return;
    sendMessage({
      conversationId: selectedConv.conversationId,
      sender: sub,
      content,
      type: "text",
    });
  };

  return (
    <div className="flex">
      <div className="w-1/3 border-r">
        {conversations.map((conv) => (
          <div
            key={conv.conversationId}
            onClick={() => setSelectedConv(conv)}
            className="cursor-pointer p-2 hover:bg-gray-100"
          >
            <div>
              {conv.other.firstName} {conv.other.lastName}
            </div>
            <div className="text-sm text-gray-500">
              {conv.lastMessage?.content || "No messages"}
            </div>
          </div>
        ))}
      </div>
      <div className="flex h-screen w-2/3 flex-col p-2">
        <div className="flex-1 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`my-1 rounded p-2 ${
                msg.sender._id === sub
                  ? "self-end bg-blue-200"
                  : "self-start bg-gray-200"
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>
        {selectedConv && (
          <div className="flex">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 rounded border p-2"
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  handleSendMessage((e.target as HTMLInputElement).value);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatsContent;
