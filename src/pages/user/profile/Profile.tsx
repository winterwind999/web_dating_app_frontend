import { getUserApi } from "@/apis/usersApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import ProfileForm from "./ProfileForm";

const Profile = () => {
  const axiosPrivate = useAxiosPrivate();
  const { sub } = useAuth();

  const { data, isLoading, isSuccess, isError, error, refetch } = useQuery({
    queryFn: () => getUserApi(axiosPrivate, sub),
    queryKey: ["getUser"],
    refetchInterval: 60000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card>
          <CardContent>
            <Spinner />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="min-w-1/5">
          <CardHeader>
            Get User Error: {error?.message || "Internal Server Error"}
          </CardHeader>
          <CardFooter>
            <div className="flex w-full justify-center">
              <Button
                type="button"
                color="default"
                aria-label="refetch"
                onClick={() => refetch()}
              >
                REFETCH
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!isSuccess) {
    return null;
  }

  return <ProfileForm user={data} />;
};

export default Profile;
