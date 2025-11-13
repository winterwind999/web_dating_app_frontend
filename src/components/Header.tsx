"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <nav className="flex items-center justify-around gap-3">
      <Link href="/">
        <Image
          src="/assets/Matchy_Icon_Logo.png"
          alt="matchy-logo-lightmode"
          width={150}
          height={50}
          className="dark:hidden"
        />
        <Image
          src="/assets/Matchy_Icon_Logo_DarkMode.png"
          alt="matchy-logo-darkmode"
          width={150}
          height={50}
          className="hidden dark:block"
        />
      </Link>

      <div className="flex items-center gap-3">
        <ThemeSwitcher />

        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </nav>
  );
}
