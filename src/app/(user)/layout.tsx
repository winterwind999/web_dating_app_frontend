import UserHeader from "@/components/UserHeader";
import { getCurrentUserId } from "@/utils/getCurrentUserId";
import { ReactNode } from "react";
import SocketClient from "./socket-client";

type Props = {
  children: ReactNode;
};

export default async function UserLayout({ children }: Props) {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return (
    <>
      <SocketClient userId={userId}>
        <UserHeader />
        <main>{children}</main>
      </SocketClient>
    </>
  );
}
