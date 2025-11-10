import { type Chat, type User } from "@/utils/constants";
import { formatCreatedAt } from "@/utils/formatCreatedAt";

type Props = {
  chat: Chat;
  userId: string;
};

export default function Chat({ chat, userId }: Props) {
  const isOwnChat = (chat.receiverUser as User)._id === userId;

  return (
    <div className={`flex ${isOwnChat ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[70%] rounded-xl px-4 py-2 ${
          isOwnChat
            ? "bg-secondary text-secondary-foreground"
            : "bg-primary text-primary-foreground"
        } flex flex-col gap-2`}
      >
        <p className="wrap-break-word">{chat.content}</p>
        <p
          className={`${isOwnChat ? "text-secondary-foreground/80 text-start" : "text-primary-foreground/80 text-end"} text-xs`}
        >
          {formatCreatedAt(chat.createdAt)}
        </p>
      </div>
    </div>
  );
}
