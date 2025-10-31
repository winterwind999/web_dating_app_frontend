import { logoutApi } from "@/apis/authApi";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { useAuthStore } from "@/stores/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HomeIcon, MessageCircleIcon, UserIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Notifications from "./notifications/Notifications";

const UserHeader = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logoutStore = useAuthStore((state) => state.logout);

  const { mutateAsync: logout, isPending } = useMutation({
    mutationFn: () => logoutApi(axiosPrivate),
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      navigate("/", { replace: true });
    },
  });

  const onLogout = async () => {
    await logout();
  };

  return (
    <nav className="flex items-center justify-around gap-3">
      <Link to="/">
        <img
          src="/assets/Matchy_Icon_Logo.png"
          alt="matchy-logo"
          width={150}
          height={50}
          className="dark:hidden"
        />
        <img
          src="/assets/Matchy_Icon_Logo_DarkMode.png"
          alt="matchy-logo"
          width={150}
          height={50}
          className="hidden dark:block"
        />
      </Link>

      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger className="bg-secondary hover:bg-primary hover:text-light rounded-full p-2">
            <Link to="/user">
              <HomeIcon />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Home</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger className="bg-secondary hover:bg-primary hover:text-light rounded-full p-2">
            <Link to="/user/chats">
              <MessageCircleIcon />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Chats</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger className="bg-secondary hover:bg-prim ary hover:text-light rounded-full p-2">
            <Link to="/user/profile">
              <UserIcon />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Profile</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-3">
        <Notifications />

        <ThemeSwitcher />

        <Button variant="destructive" onClick={onLogout} disabled={isPending}>
          {isPending && <Spinner />} Logout
        </Button>
      </div>
    </nav>
  );
};

export default UserHeader;
