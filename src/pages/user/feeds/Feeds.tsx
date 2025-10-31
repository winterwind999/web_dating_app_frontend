import { getFeedsApi } from "@/apis/feedsApi";
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
import FeedsContent from "./FeedsContent";

const Feeds = () => {
  const axiosPrivate = useAxiosPrivate();
  const { sub } = useAuth();

  const { data, isLoading, isSuccess, isError, error, refetch } = useQuery({
    queryFn: () => getFeedsApi(axiosPrivate, sub),
    queryKey: ["getFeeds"],
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
            Get Feeds Error: {error?.message || "Internal Server Error"}
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

  const {
    feeds,
    message,
    total,
  }: { feeds: User[]; message: string; total: number } = data;

  return <FeedsContent feeds={feeds} message={message} total={total} />;
};

export default Feeds;
