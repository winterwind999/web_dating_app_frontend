import {
  getAllNotificationsAction,
  updateNotificationsAction,
} from "@/actions/notifications-action";
import { useSocketStore } from "@/stores/socket-store";
import { type Notification } from "@/utils/constants";
import { formatCreatedAt } from "@/utils/formatCreatedAt";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { BellIcon, BellRingIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { Spinner } from "./ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function Notifications() {
  const { socket } = useSocketStore();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px",
  });

  const fetchNotifications = useCallback(
    async (pageToFetch = page) => {
      if (isLoading || pageToFetch > totalPages) {
        return;
      }

      setIsLoading(true);

      try {
        const { notifications: newNotifications, totalPages: newTotalPages } =
          await getAllNotificationsAction(pageToFetch);

        setTotalPages(newTotalPages);
        if (pageToFetch === 1) {
          setNotifications(newNotifications);
          const unreadNotifications = newNotifications.filter(
            (notification: Notification) => !notification.isRead,
          ).length;
          setUnreadCount(unreadNotifications);
        } else {
          setNotifications((prev) => [...newNotifications, ...prev]);
        }
      } catch (error) {
        toast.error("Failed to load conversations");
      } finally {
        setIsLoading(false);
      }
    },
    [page, isLoading, totalPages],
  );

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  useEffect(() => {
    if (entry?.isIntersecting && !isLoading && page < totalPages) {
      setPage((prev) => prev + 1);
    }
  }, [entry?.isIntersecting, isLoading, page, totalPages]);

  useEffect(() => {
    if (page > 1) {
      fetchNotifications(page);
    }
  }, [page]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const onReceiveNotification = (payload: any) => {
      if (payload?.isError) {
        toast.error(payload.errorMessage || "Failed to receive notification");
        setIsLoading(false);
        return;
      }

      if (payload?.notification) {
        setNotifications((prev) => [payload.notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        toast.success(payload.notification.message);
      }
    };

    socket.on("receiveNotification", onReceiveNotification);

    return () => {
      socket.off("receiveNotification");
    };
  }, [socket]);

  const onUpdateNotifications = async () => {
    if (unreadCount === 0) {
      return;
    }

    try {
      await updateNotificationsAction();

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      toast.error("Failed to mark notifications as read");
    }
  };

  return (
    <Tooltip>
      <Popover>
        <PopoverTrigger asChild>
          <TooltipTrigger asChild className="relative">
            <Button
              className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground rounded-full p-2"
              onClick={onUpdateNotifications}
            >
              {unreadCount > 0 ? (
                // <div>
                //   <BellRingIcon />
                //   <Badge
                //     className="h-5 min-w-5 rounded-full px-1"
                //     variant="destructive"
                //   ></Badge>
                // </div>

                <BellRingIcon />
              ) : (
                // <BellIcon />
                <BellIcon />
              )}
              {unreadCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1"
                  variant="destructive"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </Button>
          </TooltipTrigger>
        </PopoverTrigger>
        <PopoverContent asChild className="w-80">
          <ScrollArea className="h-96">
            {isLoading && notifications.length === 0 ? (
              <div className="flex h-full items-center justify-center p-8">
                <Spinner />
              </div>
            ) : notifications.length > 0 ? (
              <div className="flex flex-col gap-3">
                {notifications.map((notification: Notification, index) => (
                  <Card
                    key={notification._id}
                    className={`${!notification.isRead && "bg-secondary"} `}
                  >
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-muted-foreground text-end text-xs">
                          {formatCreatedAt(notification.createdAt)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {page < totalPages && (
                  <div ref={ref} className="flex justify-center p-4">
                    {isLoading && <Spinner />}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-8">
                <p className="text-muted-foreground text-sm">
                  No notifications yet...
                </p>
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
      <TooltipContent>Notifications</TooltipContent>
    </Tooltip>
  );
}
