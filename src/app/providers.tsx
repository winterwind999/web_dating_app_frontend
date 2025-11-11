"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

type Props = {
  children: ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      {children}
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: "",
          duration: 3000,
          removeDelay: 1000,
        }}
      />
    </NextThemesProvider>
  );
}
