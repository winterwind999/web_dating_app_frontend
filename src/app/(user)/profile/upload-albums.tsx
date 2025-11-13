"use client";

import { removeAlbumAction, uploadAlbumsAction } from "@/actions/users-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ALBUM_TYPES, CreateAlbumDto, User } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const formSchema = z.object({
  albums: z.array(
    z.object({
      id: z.number(),
      filename: z.string(),
      file: z.instanceof(File).optional(),
      type: z.enum(Object.values(ALBUM_TYPES)),
    }),
  ),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  user: User;
};

export default function UploadAlbums({ user }: Props) {
  const router = useRouter();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isPendingRemoveAlbum, setIsPendingRemoveAlbum] =
    useState<boolean>(false);

  const currentVideoAlbum = user.albums.find((album) => album.id === 1);
  const currentImage1Album = user.albums.find((album) => album.id === 2);
  const currentImage2Album = user.albums.find((album) => album.id === 3);
  const currentImage3Album = user.albums.find((album) => album.id === 4);
  const currentImage4Album = user.albums.find((album) => album.id === 5);

  const videoAlbumRef = useRef<HTMLInputElement | null>(null);
  const image1AlbumRef = useRef<HTMLInputElement | null>(null);
  const image2AlbumRef = useRef<HTMLInputElement | null>(null);
  const image3AlbumRef = useRef<HTMLInputElement | null>(null);
  const image4AlbumRef = useRef<HTMLInputElement | null>(null);

  const { handleSubmit, watch, reset, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      albums: user.albums.map((album) => ({
        id: album.id,
        filename: album.secure_url,
        file: undefined,
        type: album.type,
      })),
    },
  });
  const formAlbums = watch("albums");
  const videoAlbum = formAlbums.find((album) => album.id === 1);
  const image1Album = formAlbums.find((album) => album.id === 2);
  const image2Album = formAlbums.find((album) => album.id === 3);
  const image3Album = formAlbums.find((album) => album.id === 4);
  const image4Album = formAlbums.find((album) => album.id === 5);

  useEffect(() => {
    const objectUrls: string[] = [];

    const videoPreview = document.getElementById(
      "video-preview",
    ) as HTMLInputElement;
    if (videoAlbum?.file) {
      videoPreview.src = URL.createObjectURL(videoAlbum.file);
      objectUrls.push(videoPreview.src);
    }

    const image1Preview = document.getElementById(
      "image1-preview",
    ) as HTMLInputElement;
    if (image1Album?.file) {
      image1Preview.src = URL.createObjectURL(image1Album.file);
      objectUrls.push(image1Preview.src);
    }

    const image2Preview = document.getElementById(
      "image2-preview",
    ) as HTMLInputElement;
    if (image2Album?.file) {
      image2Preview.src = URL.createObjectURL(image2Album.file);
      objectUrls.push(image2Preview.src);
    }

    const image3Preview = document.getElementById(
      "image3-preview",
    ) as HTMLInputElement;
    if (image3Album?.file) {
      image3Preview.src = URL.createObjectURL(image3Album.file);
      objectUrls.push(image3Preview.src);
    }

    const image4Preview = document.getElementById(
      "image4-preview",
    ) as HTMLInputElement;
    if (image4Album?.file) {
      image4Preview.src = URL.createObjectURL(image4Album.file);
      objectUrls.push(image4Preview.src);
    }

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [
    videoAlbum?.file,
    image1Album?.file,
    image2Album?.file,
    image3Album?.file,
    image4Album?.file,
  ]);

  const onSubmit = async () => {
    setIsPending(true);

    const formData = new FormData();
    const sortedAlbums = [...formAlbums].sort((a, b) => a.id - b.id);

    formData.append("metadata", JSON.stringify(sortedAlbums));
    for (const album of sortedAlbums) {
      if (album.file) {
        formData.append("albums", album.file);
      }
    }

    const res = await uploadAlbumsAction(formData);

    if (res.statusCode >= 400) {
      setIsPending(false);
      toast.error(res.response);
      return;
    }

    router.refresh();

    setIsPending(false);
    reset();
  };

  const onRemoveAlbum = async (albumId: number) => {
    setIsPendingRemoveAlbum(true);

    const res = await removeAlbumAction(albumId);

    if (res.statusCode >= 400) {
      setIsPendingRemoveAlbum(false);
      toast.error(res.response);
      return;
    }

    router.refresh();

    setIsPendingRemoveAlbum(false);
  };

  return (
    <Card>
      <CardContent>
        <form
          id="upload-albums-form"
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <p>Albums</p>
          <Field>
            <FieldLabel htmlFor="video">
              Video <span className="text-muted-foreground">(max 10MB)</span>
            </FieldLabel>
            <Input
              ref={videoAlbumRef}
              id="video"
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  if (file.size > 10 * 1024 * 1024) {
                    toast.error("File size exceeds 10MB limit");
                    e.target.value = "";
                    return;
                  }

                  const filteredAlbums = formAlbums.filter(
                    (album) => album.id !== 1,
                  );

                  const newFile: CreateAlbumDto = {
                    id: 1,
                    filename: file.name,
                    file: file,
                    type: "Video",
                  };

                  const newAlbums = [...filteredAlbums, newFile];

                  setValue("albums", newAlbums);
                }
              }}
              disabled={isPending || isPendingRemoveAlbum}
            />
            {videoAlbum?.file && (
              <div className="flex flex-col items-center gap-3">
                <video
                  id="video-preview"
                  className="h-[500px] max-w-md"
                  controls
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    if (isPending || isPendingRemoveAlbum) {
                      return;
                    }

                    const filteredAlbums = formAlbums.filter(
                      (album) => album.id !== 1,
                    );
                    setValue("albums", filteredAlbums);
                    if (videoAlbumRef.current) {
                      videoAlbumRef.current.value = "";
                    }
                  }}
                  disabled={isPending || isPendingRemoveAlbum}
                >
                  Remove
                </Button>
              </div>
            )}
            {currentVideoAlbum && !videoAlbum?.file && (
              <div className="flex flex-col items-center gap-3">
                <video
                  src={currentVideoAlbum.secure_url}
                  className="h-[500px] max-w-md"
                  controls
                  playsInline
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => onRemoveAlbum(1)}
                  disabled={isPending || isPendingRemoveAlbum}
                >
                  {isPendingRemoveAlbum ? <Spinner /> : "Remove"}
                </Button>
              </div>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="image1">
              Image 1 <span className="text-muted-foreground">(max 10MB)</span>
            </FieldLabel>
            <Input
              ref={image1AlbumRef}
              id="image1"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  if (file.size > 10 * 1024 * 1024) {
                    toast.error("File size exceeds 10MB limit");
                    e.target.value = "";
                    return;
                  }

                  const filteredAlbums = formAlbums.filter(
                    (album) => album.id !== 2,
                  );

                  const newAlbum: CreateAlbumDto = {
                    id: 2,
                    filename: file.name,
                    file: file,
                    type: "Image",
                  };

                  const newAlbums = [...filteredAlbums, newAlbum];

                  setValue("albums", newAlbums);
                }
              }}
              disabled={isPending || isPendingRemoveAlbum}
            />
            {image1Album?.file && (
              <div className="flex flex-col items-center gap-3">
                <img
                  id="image1-preview"
                  alt="image1-preview"
                  className="h-[500px] max-w-md"
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    if (isPending || isPendingRemoveAlbum) {
                      return;
                    }

                    const filteredAlbums = formAlbums.filter(
                      (album) => album.id !== 2,
                    );
                    setValue("albums", filteredAlbums);
                    if (image1AlbumRef.current) {
                      image1AlbumRef.current.value = "";
                    }
                  }}
                  disabled={isPending || isPendingRemoveAlbum}
                >
                  Remove
                </Button>
              </div>
            )}
            {currentImage1Album && !image1Album?.file && (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={currentImage1Album.secure_url}
                  alt={`${currentImage1Album.id}-image1`}
                  className="h-[500px] max-w-md"
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => onRemoveAlbum(2)}
                  disabled={isPending || isPendingRemoveAlbum}
                >
                  {isPendingRemoveAlbum ? <Spinner /> : "Remove"}
                </Button>
              </div>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="image2">
              Image 2 <span className="text-muted-foreground">(max 10MB)</span>
            </FieldLabel>
            <Input
              ref={image2AlbumRef}
              id="image2"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  if (file.size > 10 * 1024 * 1024) {
                    toast.error("File size exceeds 10MB limit");
                    e.target.value = "";
                    return;
                  }

                  const filteredAlbums = formAlbums.filter(
                    (album) => album.id !== 3,
                  );

                  const newFile: CreateAlbumDto = {
                    id: 3,
                    filename: file.name,
                    file: file,
                    type: "Image",
                  };

                  const newAlbums = [...filteredAlbums, newFile];

                  setValue("albums", newAlbums);
                }
              }}
              disabled={isPending || isPendingRemoveAlbum}
            />
            {image2Album?.file && (
              <div className="flex flex-col items-center gap-3">
                <img
                  id="image2-preview"
                  alt="image2-preview"
                  className="h-[500px] max-w-md"
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    if (isPending || isPendingRemoveAlbum) {
                      return;
                    }

                    const filteredAlbums = formAlbums.filter(
                      (album) => album.id !== 3,
                    );
                    setValue("albums", filteredAlbums);
                    if (image2AlbumRef.current) {
                      image2AlbumRef.current.value = "";
                    }
                  }}
                  disabled={isPending || isPendingRemoveAlbum}
                >
                  Remove
                </Button>
              </div>
            )}
            {currentImage2Album && !image2Album?.file && (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={currentImage2Album.secure_url}
                  alt={`${currentImage2Album.id}-image2`}
                  className="h-[500px] max-w-md"
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => onRemoveAlbum(3)}
                  disabled={isPending || isPendingRemoveAlbum}
                >
                  {isPendingRemoveAlbum ? <Spinner /> : "Remove"}
                </Button>
              </div>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="image3">
              Image 3 <span className="text-muted-foreground">(max 10MB)</span>
            </FieldLabel>
            <Input
              ref={image3AlbumRef}
              id="image3"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  if (file.size > 10 * 1024 * 1024) {
                    toast.error("File size exceeds 10MB limit");
                    e.target.value = "";
                    return;
                  }

                  const filteredAlbums = formAlbums.filter(
                    (album) => album.id !== 4,
                  );

                  const newFile: CreateAlbumDto = {
                    id: 4,
                    filename: file.name,
                    file: file,
                    type: "Image",
                  };

                  const newAlbums = [...filteredAlbums, newFile];

                  setValue("albums", newAlbums);
                }
              }}
              disabled={isPending || isPendingRemoveAlbum}
            />
            {image3Album?.file && (
              <div className="flex flex-col items-center gap-3">
                <img
                  id="image3-preview"
                  alt="image3-preview"
                  className="h-[500px] max-w-md"
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    if (isPending || isPendingRemoveAlbum) {
                      return;
                    }

                    const filteredAlbums = formAlbums.filter(
                      (album) => album.id !== 4,
                    );
                    setValue("albums", filteredAlbums);
                    if (image3AlbumRef.current) {
                      image3AlbumRef.current.value = "";
                    }
                  }}
                  disabled={isPending || isPendingRemoveAlbum}
                >
                  Remove
                </Button>
              </div>
            )}
            {currentImage3Album && !image3Album?.file && (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={currentImage3Album.secure_url}
                  alt={`${currentImage3Album.id}-image3`}
                  className="h-[500px] max-w-md"
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => onRemoveAlbum(4)}
                  disabled={isPending || isPendingRemoveAlbum}
                >
                  {isPendingRemoveAlbum ? <Spinner /> : "Remove"}
                </Button>
              </div>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="image4">
              Image 4 <span className="text-muted-foreground">(max 10MB)</span>
            </FieldLabel>
            <Input
              ref={image4AlbumRef}
              id="image4"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  if (file.size > 10 * 1024 * 1024) {
                    toast.error("File size exceeds 10MB limit");
                    e.target.value = "";
                    return;
                  }

                  const filteredAlbums = formAlbums.filter(
                    (album) => album.id !== 5,
                  );

                  const newFile: CreateAlbumDto = {
                    id: 5,
                    filename: file.name,
                    file: file,
                    type: "Image",
                  };

                  const newAlbums = [...filteredAlbums, newFile];

                  setValue("albums", newAlbums);
                }
              }}
              disabled={isPending || isPendingRemoveAlbum}
            />
            {image4Album?.file && (
              <div className="flex flex-col items-center gap-3">
                <img
                  id="image4-preview"
                  alt="image4-preview"
                  className="h-[500px] max-w-md"
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    if (isPending || isPendingRemoveAlbum) {
                      return;
                    }

                    const filteredAlbums = formAlbums.filter(
                      (album) => album.id !== 5,
                    );
                    setValue("albums", filteredAlbums);
                    if (image4AlbumRef.current) {
                      image4AlbumRef.current.value = "";
                    }
                  }}
                  disabled={isPending || isPendingRemoveAlbum}
                >
                  Remove
                </Button>
              </div>
            )}
            {currentImage4Album && !image4Album?.file && (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={currentImage4Album.secure_url}
                  alt={`${currentImage4Album.id}-image4`}
                  className="h-[500px] max-w-md"
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => onRemoveAlbum(5)}
                  disabled={isPending || isPendingRemoveAlbum}
                >
                  {isPendingRemoveAlbum ? <Spinner /> : "Remove"}
                </Button>
              </div>
            )}
          </Field>
        </form>
      </CardContent>
      <CardFooter>
        <Field
          orientation="horizontal"
          className="flex w-full items-center justify-center"
        >
          <Button
            type="submit"
            form="upload-albums-form"
            size="2xl"
            disabled={isPending || isPendingRemoveAlbum}
          >
            {isPending && <Spinner />} UPLOAD ALBUMS
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
