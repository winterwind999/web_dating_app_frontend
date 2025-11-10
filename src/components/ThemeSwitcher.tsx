"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme ?? "light";

  const capitalizedTheme =
    currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Tooltip>
      <TooltipTrigger
        className="hover:bg-background dark:hover:text-light rounded-full p-2 transition-colors"
        onClick={toggleTheme}
      >
        {theme === "dark" ? (
          <MoonIcon className="size-6 outline-0" />
        ) : (
          <SunIcon className="size-6 outline-0" />
        )}
      </TooltipTrigger>
      <TooltipContent>{capitalizedTheme}</TooltipContent>
    </Tooltip>
  );
}
