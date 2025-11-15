// import { getFeedsAction } from "@/actions/feeds-action";
// import { type User } from "@/utils/constants";
// import Feeds from "./feeds";

// export default async function FeedsPage() {
//   const data = await getFeedsAction();

//   const {
//     feeds,
//     message,
//     total,
//   }: { feeds: User[]; message: string; total: number } = data;

//   return (
//     <Feeds initialFeeds={feeds} initialMessage={message} initialTotal={total} />
//   );
// }

"use client";

import { BACKEND_URL, User } from "@/utils/constants";
import { useEffect, useState } from "react";
import Feeds from "./feeds";

export default function FeedsPage() {
  const [data, setData] = useState<{
    feeds: User[];
    message: string;
    total: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/me`, {
          method: "GET",
          credentials: "include",
        });

        console.log("res", res);

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const { userId } = await res.json();

        console.log("userId", userId);

        const feedsRes = await fetch(`${BACKEND_URL}/api/feeds/${userId}`, {
          method: "GET",
          credentials: "include",
        });

        console.log("feedsRes", feedsRes);

        if (!feedsRes.ok) {
          throw new Error("Failed to load feeds");
        }

        const feedsData = await feedsRes.json();

        console.log("feedsData", feedsData);

        setData(feedsData);
      } catch (err: any) {
        setError(err.message || "Error");
      }
    }
    load();
  }, []);

  if (error) {
    return <div className="p-6">You must be signed in to view feeds.</div>;
  }

  if (!data) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <Feeds
      initialFeeds={data.feeds}
      initialMessage={data.message}
      initialTotal={data.total}
    />
  );
}
