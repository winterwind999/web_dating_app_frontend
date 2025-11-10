import { getUserAction } from "@/actions/users-action";
import Profile from "./profile";

export default async function ProfilePage() {
  const user = await getUserAction();

  return <Profile user={user} />;
}
