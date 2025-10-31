import { createDislikeApi } from "@/apis/dlikesApi";
import { createLikeApi } from "@/apis/likesApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, HeartIcon, XIcon } from "lucide-react";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useSwipeable } from "react-swipeable";

type Props = {
  feeds: User[];
  message: string;
  total: number;
};

const FeedsContent = ({ feeds, message, total }: Props) => {
  const axiosPrivate = useAxiosPrivate();
  const { sub } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [albumIndex, setAlbumIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(
    null,
  );

  const currentUser = feeds[currentIndex];
  const sortedAlbums =
    currentUser?.albums?.sort((a, b) => a.sortOrder - b.sortOrder) || [];

  const { mutateAsync: createLike, isPending: isPendingCreateLike } =
    useMutation({
      mutationFn: (createLikeDto: CreateLikeDto) =>
        createLikeApi(axiosPrivate, createLikeDto),
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutateAsync: createDislike, isPending: isPendingCreateDislike } =
    useMutation({
      mutationFn: (createDislikeDto: CreateDislikeDto) =>
        createDislikeApi(axiosPrivate, createDislikeDto),
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const calculateAge = (birthday: string) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (!currentUser || isPendingCreateLike || isPendingCreateDislike) return;

      setExitDirection(direction);

      if (direction === "right") {
        createLike({ user: sub, likedUser: currentUser._id });
      } else {
        createDislike({ user: sub, dislikedUser: currentUser._id });
      }

      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setAlbumIndex(0);
        setExitDirection(null);
      }, 300);
    },
    [currentUser, createLike, createDislike],
  );

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      handleSwipe("right");
    } else if (info.offset.x < -threshold) {
      handleSwipe("left");
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

  if (message) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-lg">{message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (total === 0 || currentIndex >= feeds.length) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-lg">No more profiles to show</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Check back later for new matches!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentAlbum = sortedAlbums[albumIndex];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="relative w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentUser._id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{
              x:
                exitDirection === "left"
                  ? -500
                  : exitDirection === "right"
                    ? 500
                    : 0,
              opacity: 0,
              rotate:
                exitDirection === "left"
                  ? -20
                  : exitDirection === "right"
                    ? 20
                    : 0,
            }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            {...handlers}
            className="cursor-grab active:cursor-grabbing"
          >
            <Card className="overflow-hidden shadow-2xl">
              <div className="relative h-[500px]">
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

                <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                  <h2 className="text-3xl font-bold">
                    {currentUser.firstName} {currentUser.lastName},{" "}
                    {calculateAge(currentUser.birthday)}
                  </h2>
                  <p className="mt-1 text-sm opacity-90">
                    {currentUser.address.city}, {currentUser.address.province}
                  </p>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-semibold">About</h3>
                    <p className="text-sm text-gray-600">
                      {currentUser.shortBio}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 font-semibold">Interests</h3>
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

        <div className="mt-6 flex justify-center gap-6">
          <Button
            size="lg"
            variant="destructive"
            className="h-16 w-16 rounded-full shadow-lg"
            onClick={() => handleSwipe("left")}
            disabled={isPendingCreateDislike || isPendingCreateDislike}
          >
            <XIcon className="h-8 w-8" />
          </Button>

          <Button
            size="lg"
            variant="default"
            className="h-16 w-16 rounded-full bg-pink-500 shadow-lg hover:bg-pink-600"
            onClick={() => handleSwipe("right")}
            disabled={isPendingCreateDislike || isPendingCreateDislike}
          >
            <HeartIcon className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedsContent;
