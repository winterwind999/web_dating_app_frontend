"use client";

import { healthCheckAction } from "@/actions/auth-action";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode, useEffect } from "react";
import { Toaster } from "react-hot-toast";

type Props = {
  children: ReactNode;
};

export default function Providers({ children }: Props) {
  useEffect(() => {
    const onHealthCheck = async () => {
      await healthCheckAction();
    };

    onHealthCheck();
  }, []);

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
