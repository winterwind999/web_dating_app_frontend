
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useRefreshToken } from "../hooks/useRefreshToken";
import { useAuthStore } from "@/stores/authStore";
import { Card, CardContent } from "./ui/card";
import { Spinner } from "./ui/spinner";

const PersistLogin = () => {
  const refresh = useRefreshToken();

  const accessToken = useAuthStore((state) => state.accessToken);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!accessToken) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex min-h-screen items-center justify-center">
          <Card>
            <CardContent>
              <Spinner />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
