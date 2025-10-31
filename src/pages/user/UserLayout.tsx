import { Outlet } from "react-router-dom";
import UserHeader from "./UserHeader";

const UserLayout = () => {
  return (
    <main>
      <UserHeader />
      <Outlet />
    </main>
  );
};

export default UserLayout;
