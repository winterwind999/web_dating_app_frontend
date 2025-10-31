import { getAllChatsApi } from "@/apis/chatsApi";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import ChatsContent from "./ChatsContent";

const Chats = () => {
  const axiosPrivate = useAxiosPrivate();
  const { sub } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["getAllChats", sub],
    queryFn: () => getAllChatsApi(axiosPrivate, sub),
    refetchInterval: 60000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <Spinner />;

  return <ChatsContent conversations={data || []} />;
};

export default Chats;
