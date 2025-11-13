"use client";

import { createDislikeAction } from "@/actions/dislikes-action";
import { getFeedsAction } from "@/actions/feeds-action";
import { createLikeAction } from "@/actions/likes-action";
import Block from "@/components/Block";
import Report from "@/components/Report";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { calculateAge } from "@/utils/calculateAge";
import { type User } from "@/utils/constants";
import {
  AnimatePresence,
  motion,
  PanInfo,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { ChevronLeft, ChevronRight, HeartIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  initialFeeds: User[];
  initialMessage: string;
  initialTotal: number;
};

export default function Feeds({
  initialFeeds,
  initialMessage,
  initialTotal,
}: Props) {
  const [feeds, setFeeds] = useState<User[]>(initialFeeds);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [message, setMessage] = useState<string>(initialMessage);
  const [albumIndex, setAlbumIndex] = useState<number>(0);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(
    null,
  );
  const [isPendingCreateLike, setIsPendingCreateLike] =
    useState<boolean>(false);
  const [isPendingCreateDislike, setIsPendingCreateDislike] =
    useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMoreProfiles, setHasMoreProfiles] = useState<boolean>(
    initialTotal > initialFeeds.length,
  );

  const hasPrefetchedRef = useRef(false);
  const seenProfileIdsRef = useRef<Set<string>>(
    new Set(initialFeeds.map((feed) => feed._id)),
  );
  const currentUser = feeds[currentIndex];
  const sortedAlbums = currentUser?.albums?.sort((a, b) => a.id - b.id) || [];
  const currentAlbum = sortedAlbums[albumIndex];

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 0, 150], [-15, 0, 15]);
  const opacity = useTransform(x, [-150, 0, 150], [0.6, 1, 0.6]);

  useEffect(() => {
    x.set(0);
    rotate.set(0);
    setExitDirection(null);
    setAlbumIndex(0);
  }, [currentUser?._id, x]);

  const fetchMoreFeeds = useCallback(async () => {
    if (isLoadingMore || !hasMoreProfiles) {
      return;
    }

    setIsLoadingMore(true);
    try {
      const data = await getFeedsAction();

      const newFeeds = data.feeds.filter(
        (feed: User) => !seenProfileIdsRef.current.has(feed._id),
      );

      if (data.feeds.length > 0) {
        newFeeds.forEach((feed: User) =>
          seenProfileIdsRef.current.add(feed._id),
        );
        setFeeds((prev) => [...prev, ...newFeeds]);
        setHasMoreProfiles(data.total > 0);
      } else {
        setHasMoreProfiles(false);
        setMessage(data.message || "No more profiles available");
      }
    } catch (error) {
      toast.error("Failed to load more profiles");
      setHasMoreProfiles(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMoreProfiles]);

  const handleSwipe = useCallback(
    async (direction: "left" | "right") => {
      if (!currentUser || isPendingCreateLike || isPendingCreateDislike) {
        return;
      }

      setExitDirection(direction);

      if (direction === "right") {
        setIsPendingCreateLike(true);
        const res = await createLikeAction(currentUser._id);

        if (res.statusCode >= 400) {
          setIsPendingCreateLike(false);
          setExitDirection(null);
          toast.error(res.response);
          return;
        }
        setIsPendingCreateLike(false);
      } else {
        setIsPendingCreateDislike(true);
        const res = await createDislikeAction(currentUser._id);

        if (res.statusCode >= 400) {
          setIsPendingCreateDislike(false);
          setExitDirection(null);
          toast.error(res.response);
          return;
        }
        setIsPendingCreateDislike(false);
      }

      setTimeout(async () => {
        hasPrefetchedRef.current = false;
        setFeeds((prev) => prev.filter((_, index) => index !== currentIndex));
        setCurrentIndex(0);
        setAlbumIndex(0);
        x.set(0);
        setExitDirection(null);

        if (hasMoreProfiles && !isLoadingMore) {
          await fetchMoreFeeds();
        } else if (!hasMoreProfiles) {
          setMessage("No more profiles available");
        }
      }, 300);
    },
    [currentUser, isPendingCreateLike, isPendingCreateDislike, currentIndex, x],
  );

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 120;
    if (info.offset.x > threshold) {
      handleSwipe("right");
    } else if (info.offset.x < -threshold) {
      handleSwipe("left");
    } else {
      x.set(0);
    }
  };

  const nextAlbum = () => {
    if (albumIndex < sortedAlbums.length - 1) {
      setAlbumIndex((prev) => prev + 1);
    }
  };

  const prevAlbum = () => {
    if (albumIndex > 0) {
      setAlbumIndex((prev) => prev - 1);
    }
  };

  if (feeds.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-lg">{message || "No more profiles to show"}</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Check back later for new matches!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center overflow-hidden py-5">
      <div className="flex w-full items-center justify-center gap-3">
        <Button
          size="lg"
          variant="destructive"
          className="z-40 h-16 w-16 rounded-full shadow-lg"
          onClick={() => handleSwipe("left")}
          disabled={isPendingCreateLike || isPendingCreateDislike}
        >
          <XIcon className="h-8 w-8" />
        </Button>

        <div className="relative w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentUser._id}
              style={{
                x,
                rotate,
                opacity,
                cursor: "grab",
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              dragElastic={0.2}
              dragSnapToOrigin={false}
              whileTap={{ cursor: "grabbing" }}
              initial={{ x: 0, y: 20, rotate: 0, scale: 0.9, opacity: 0 }}
              animate={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
              exit={{
                x:
                  exitDirection === "left"
                    ? -500
                    : exitDirection === "right"
                      ? 500
                      : 0,
                opacity: 0,
                transition: { duration: 0.25 },
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="flex flex-col gap-2">
                  <div className="h-[500px]">
                    {currentAlbum?.type === "Image" ? (
                      <img
                        src={currentAlbum.secure_url}
                        alt={`${currentUser.firstName}'s photo`}
                        className="h-full w-full object-cover"
                      />
                    ) : currentAlbum?.type === "Video" ? (
                      <video
                        src={currentAlbum.secure_url}
                        className="h-full w-full object-cover"
                        controls
                        playsInline
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200">
                        <p className="text-gray-500">No media available</p>
                      </div>
                    )}

                    {sortedAlbums.length > 1 && (
                      <>
                        <div className="absolute top-4 right-0 left-0 flex justify-center gap-1 px-4">
                          {sortedAlbums.map((_, idx) => (
                            <div
                              key={idx}
                              className={`h-1 flex-1 rounded-full ${
                                idx === albumIndex ? "bg-white" : "bg-white/40"
                              }`}
                            />
                          ))}
                        </div>

                        {albumIndex > 0 && (
                          <button
                            onClick={prevAlbum}
                            className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </button>
                        )}

                        {albumIndex < sortedAlbums.length - 1 && (
                          <button
                            onClick={nextAlbum}
                            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                          >
                            <ChevronRight className="h-6 w-6" />
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={currentUser.photo.secure_url!}
                        alt={`${currentUser._id}-photo`}
                        className="rounded-full"
                        width={50}
                        height={50}
                      />

                      <p className="text-3xl font-bold">
                        {currentUser.firstName} {currentUser.lastName},{" "}
                        {calculateAge(currentUser.birthday)}
                      </p>

                      <Block user={currentUser} />

                      <Report user={currentUser} />
                    </div>

                    <p className="text-sm">
                      {currentUser.address.city}, {currentUser.address.province}
                    </p>

                    <div>
                      <p className="ont-semibold">About</p>
                      <p className="text-sm text-gray-600">
                        {currentUser.shortBio}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold">Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {currentUser.interests.map((interest, idx) => (
                          <Badge key={idx} variant="secondary">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {isLoadingMore && (
            <div className="absolute flex items-center justify-center">
              <Card>
                <CardContent>
                  <Spinner />
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <Button
          size="lg"
          variant="default"
          className="bg-primary z-40 h-16 w-16 rounded-full"
          onClick={() => handleSwipe("right")}
          disabled={isPendingCreateLike || isPendingCreateDislike}
        >
          <HeartIcon className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
}
