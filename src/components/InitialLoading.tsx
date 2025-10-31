import { healthCheckApi } from "@/apis/authApi";
import Landing from "@/pages/landing/Landing";
import { useTheme } from "@/utils/themeProvider";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const InitialLoading = () => {
  const { theme } = useTheme();

  const [progress, setProgress] = useState<number>(0);
  const [fadeOut, setFadeOut] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);

  const { isLoading, isSuccess } = useQuery({
    queryFn: () => healthCheckApi(),
    queryKey: ["healthCheck"],
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isLoading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            return 90;
          }

          const increment = Math.floor(Math.random() * 10) + 1;
          const next = prev + increment;

          return next >= 90 ? 90 : next;
        });
      }, 50);
    } else if (isSuccess) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (interval) {
              clearInterval(interval);
            }
            return 100;
          }

          const increment = Math.floor(Math.random() * 10) + 1;
          const next = prev + increment;

          return next >= 100 ? 100 : next;
        });
      }, 50);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLoading, isSuccess]);

  useEffect(() => {
    if (progress === 100 && isSuccess) {
      const timer = setTimeout(() => {
        setFadeOut(true);
        const t = setTimeout(() => {
          setDone(true);
        }, 500);
        return () => clearTimeout(t);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [progress, isSuccess]);

  useEffect(() => {
    if (!done) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [done]);

  return (
    <>
      <Landing />

      {!done && (
        <main
          className={`bg-background fixed inset-0 z-50 flex min-h-screen items-center justify-center transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}
        >
          <div className="flex flex-col items-center justify-center gap-5">
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

            <div className="flex flex-col gap-1">
              <div className="h-2 w-64 overflow-hidden rounded-full bg-zinc-800">
                <motion.div
                  style={{
                    background: `linear-gradient(
                      to right,
                      ${theme === "dark" ? "#44624a" : "#c0cfb2"}
                    )`,
                  }}
                  className="h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{
                    type: "spring",
                    stiffness: 50,
                    damping: 20,
                    mass: 0.5,
                  }}
                />
              </div>

              <p className="text-primary text-center">{progress}%</p>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {progress < 90 ? "Loading..." : "Almost there..."}
            </motion.p>
          </div>
        </main>
      )}
    </>
  );
};

export default InitialLoading;
