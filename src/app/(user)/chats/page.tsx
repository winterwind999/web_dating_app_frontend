import { getCurrentUserId } from "@/utils/getCurrentUserId";
import Conversation from "./conversation";
import MatchList from "./match-list";

export default async function ChatsPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return (
    <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-3">
      <div className="col-span-1">
        <MatchList userId={userId} />
      </div>
      <div className="col-span-2">
        <Conversation userId={userId} />
      </div>
    </div>
  );
}
