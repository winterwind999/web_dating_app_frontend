"use client";

import { uploadAlbumsAction } from "@/actions/users-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ALBUM_TYPES, CreateAlbumDto } from "@/utils/constants";
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
      file: z.instanceof(File),
      type: z.enum(Object.values(ALBUM_TYPES)),
    }),
  ),
});

type FormValues = z.infer<typeof formSchema>;

export default function UploadAlbums() {
  const router = useRouter();

  const [isPending, setIsPending] = useState<boolean>(false);

  const videoAlbumRef = useRef<HTMLInputElement | null>(null);
  const image1AlbumRef = useRef<HTMLInputElement | null>(null);
  const image2AlbumRef = useRef<HTMLInputElement | null>(null);
  const image3AlbumRef = useRef<HTMLInputElement | null>(null);
  const image4AlbumRef = useRef<HTMLInputElement | null>(null);

  const { handleSubmit, watch, reset, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      albums: [],
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
    if (videoAlbum?.id) {
      videoPreview.src = URL.createObjectURL(videoAlbum.file);
    }

    const image1Preview = document.getElementById(
      "image1-preview",
    ) as HTMLInputElement;
    if (image1Album?.id) {
      image1Preview.src = URL.createObjectURL(image1Album.file);
    }

    const image2Preview = document.getElementById(
      "image2-preview",
    ) as HTMLInputElement;
    if (image2Album?.id) {
      image2Preview.src = URL.createObjectURL(image2Album.file);
    }

    const image3Preview = document.getElementById(
      "image3-preview",
    ) as HTMLInputElement;
    if (image3Album?.id) {
      image3Preview.src = URL.createObjectURL(image3Album.file);
    }

    const image4Preview = document.getElementById(
      "image4-preview",
    ) as HTMLInputElement;
    if (image4Album?.id) {
      image4Preview.src = URL.createObjectURL(image4Album.file);
    }

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [
    videoAlbum?.id,
    image1Album?.id,
    image2Album?.id,
    image3Album?.id,
    image4Album?.id,
  ]);

  const onSubmit = async () => {
    if (formAlbums.length < 3) {
      toast.error("Please upload at least 3 albums");
      return;
    }

    setIsPending(true);

    const formData = new FormData();
    const sortedAlbums = [...formAlbums].sort((a, b) => a.id - b.id);
    formData.append("metadata", JSON.stringify(sortedAlbums));
    for (const album of sortedAlbums) {
      formData.append("albums", album.file);
    }

    const res = await uploadAlbumsAction(formData);

    if (res.statusCode >= 400) {
      setIsPending(false);
      toast.error(res.response);
      return;
    }

    setIsPending(false);
    reset();
    router.replace(`/feeds`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-4/5 py-10 lg:w-2/5">
        <Card>
          <CardContent>
            <form
              id="upload-albums-form"
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                ref={videoAlbumRef}
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

                    const newFile: CreateAlbumDto = {
                      id: 1,
                      filename: file.name,
                      file: file,
                      type: "Video",
                    };

                    const newAlbums = [...formAlbums, newFile];

                    setValue("albums", newAlbums);
                  }
                }}
                disabled={isPending}
              />

              {videoAlbum && (
                <div className="flex flex-col items-center gap-3">
                  <video id="video-preview" width={300} height={300} />

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      if (isPending) {
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
                    disabled={isPending}
                  >
                    Remove
                  </Button>
                </div>
              )}

              <Input
                ref={image1AlbumRef}
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

                    const newAlbum: CreateAlbumDto = {
                      id: 2,
                      filename: file.name,
                      file: file,
                      type: "Image",
                    };

                    const newAlbums = [...formAlbums, newAlbum];

                    setValue("albums", newAlbums);
                  }
                }}
                disabled={isPending}
              />

              {image1Album && (
                <div className="flex flex-col items-center gap-3">
                  <img
                    id="image1-preview"
                    alt="image1-preview"
                    width={300}
                    height={300}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      if (isPending) {
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
                    disabled={isPending}
                  >
                    Remove
                  </Button>
                </div>
              )}

              <Input
                ref={image2AlbumRef}
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

                    const newFile: CreateAlbumDto = {
                      id: 3,
                      filename: file.name,
                      file: file,
                      type: "Image",
                    };

                    const newAlbums = [...formAlbums, newFile];

                    setValue("albums", newAlbums);
                  }
                }}
                disabled={isPending}
              />

              {image2Album && (
                <div className="flex flex-col items-center gap-3">
                  <img
                    id="image2-preview"
                    alt="image2-preview"
                    width={300}
                    height={300}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      if (isPending) {
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
                    disabled={isPending}
                  >
                    Remove
                  </Button>
                </div>
              )}

              <Input
                ref={image3AlbumRef}
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

                    const newFile: CreateAlbumDto = {
                      id: 4,
                      filename: file.name,
                      file: file,
                      type: "Image",
                    };

                    const newAlbums = [...formAlbums, newFile];

                    setValue("albums", newAlbums);
                  }
                }}
                disabled={isPending}
              />

              {image3Album && (
                <div className="flex flex-col items-center gap-3">
                  <img
                    id="image3-preview"
                    alt="image3-preview"
                    width={300}
                    height={300}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      if (isPending) {
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
                    disabled={isPending}
                  >
                    Remove
                  </Button>
                </div>
              )}

              <Input
                ref={image4AlbumRef}
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

                    const newFile: CreateAlbumDto = {
                      id: 5,
                      filename: file.name,
                      file: file,
                      type: "Image",
                    };

                    const newAlbums = [...formAlbums, newFile];

                    setValue("albums", newAlbums);
                  }
                }}
                disabled={isPending}
              />

              {image4Album && (
                <div className="flex flex-col items-center gap-3">
                  <img
                    id="image4-preview"
                    alt="image4-preview"
                    width={300}
                    height={300}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      if (isPending) {
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
                    disabled={isPending}
                  >
                    Remove
                  </Button>
                </div>
              )}
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
                disabled={isPending}
              >
                {isPending && <Spinner />} NEXT
              </Button>
            </Field>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
