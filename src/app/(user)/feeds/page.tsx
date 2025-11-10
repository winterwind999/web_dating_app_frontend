import { getFeedsAction } from "@/actions/feeds-action";
import { type User } from "@/utils/constants";
import Feeds from "./feeds";

export default async function FeedsPage() {
  const data = await getFeedsAction();

  const {
    feeds,
    message,
    total,
  }: { feeds: User[]; message: string; total: number } = data;

  return (
    <Feeds initialFeeds={feeds} initialMessage={message} initialTotal={total} />
  );
}
