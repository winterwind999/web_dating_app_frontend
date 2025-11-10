"use client";

import { logoutAction } from "@/actions/auth-action";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  HomeIcon,
  MenuIcon,
  MessageCircleIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Notifications from "./Notifications";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function UserHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, setIsPending] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const onLogout = async () => {
    setIsPending(true);
    await logoutAction();
    setIsPending(false);
    router.replace(`/`);
  };

  return (
    <nav className="flex items-center justify-between border-b px-4 py-2">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <img
          src="/assets/Matchy_Icon_Logo.png"
          alt="matchy-logo"
          width={140}
          height={50}
          className="dark:hidden"
        />
        <img
          src="/assets/Matchy_Icon_Logo_DarkMode.png"
          alt="matchy-logo"
          width={140}
          height={50}
          className="hidden dark:block"
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden items-center gap-3 md:flex">
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger
              asChild
              className={` ${pathname === "/feeds" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"} hover:bg-primary hover:text-primary-foreground rounded-full p-2`}
            >
              <Link href="/feeds">
                <HomeIcon />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Home</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              asChild
              className={` ${pathname === "/chats" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"} hover:bg-primary hover:text-primary-foreground rounded-full p-2`}
            >
              <Link href="/chats">
                <MessageCircleIcon />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Chats</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              asChild
              className={` ${pathname === "/profile" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"} hover:bg-primary hover:text-primary-foreground rounded-full p-2`}
            >
              <Link href="/profile">
                <UserIcon />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Profile</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Notifications />
        <ThemeSwitcher />

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="destructive" onClick={onLogout} disabled={isPending}>
            {isPending && <Spinner />} Logout
          </Button>
        </div>
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="flex items-center md:hidden">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="hover:bg-primary hover:text-primary-foreground rounded-md p-2"
          aria-label="Toggle menu"
        >
          {menuOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="bg-background absolute top-14 left-0 z-50 flex w-full flex-col gap-2 border-b p-4 shadow-md md:hidden">
          <Link
            href="/feeds"
            className={` ${pathname === "/feeds" ? "bg-primary text-primary-foreground" : "bg-background"} hover:bg-primary hover:text-primary-foreground flex items-center gap-2 rounded-md p-2`}
            onClick={() => setMenuOpen(false)}
          >
            <HomeIcon /> Home
          </Link>
          <Link
            href="/chats"
            className={` ${pathname === "/chats" ? "bg-primary text-primary-foreground" : "bg-background"} hover:bg-primary hover:text-primary-foreground flex items-center gap-2 rounded-md p-2`}
            onClick={() => setMenuOpen(false)}
          >
            <MessageCircleIcon /> Chats
          </Link>
          <Link
            href="/profile"
            className={` ${pathname === "/profile" ? "bg-primary text-primary-foreground" : "bg-background"} hover:bg-primary hover:text-primary-foreground flex items-center gap-2 rounded-md p-2`}
            onClick={() => setMenuOpen(false)}
          >
            <UserIcon /> Profile
          </Link>

          {/* <div className="mt-2 flex items-center justify-between">
            <Notifications />
            <ThemeSwitcher />
          </div> */}

          <Button
            variant="destructive"
            onClick={() => {
              setMenuOpen(false);
              onLogout();
            }}
            disabled={isPending}
          >
            {isPending && <Spinner />} Logout
          </Button>
        </div>
      )}
    </nav>
  );
}
