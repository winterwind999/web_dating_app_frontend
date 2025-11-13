"use client";

import { uploadPhotoAction } from "@/actions/users-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Webcam from "react-webcam";
import z from "zod";

const formSchema = z.object({
  photo: z.instanceof(File).nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export default function UploadPhoto() {
  const router = useRouter();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [photoOption, setPhotoOption] = useState<"Upload" | "Webcam">("Upload");
  const [hasCamera, setHasCamera] = useState<boolean>(true);

  const webcamRef = useRef<Webcam | null>(null);
  const photoUploadRef = useRef<HTMLInputElement | null>(null);

  const { handleSubmit, watch, reset, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      photo: null,
    },
  });
  const formPhoto = watch("photo");

  useEffect(() => {
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput",
        );
        setHasCamera(videoDevices.length > 0);
      } catch (error) {
        toast.error(`Error checking for camera: ${error}`);
        setHasCamera(false);
      }
    };

    checkCamera();
  }, []);

  useEffect(() => {
    if (formPhoto) {
      const objectUrl = URL.createObjectURL(formPhoto);
      const previewElement = document.getElementById(
        photoOption === "Upload" ? "upload-preview" : "webcam-preview",
      ) as HTMLImageElement;

      if (previewElement) {
        previewElement.src = objectUrl;
      }

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [photoOption, formPhoto]);

  const onSubmit = async () => {
    if (!formPhoto) {
      return;
    }

    setIsPending(true);

    const formData = new FormData();
    formData.append("photo", formPhoto);

    const res = await uploadPhotoAction(formData);

    if (res.statusCode >= 400) {
      setIsPending(false);
      toast.error(res.response);
      return;
    }

    setIsPending(false);
    reset();
    router.replace(`/sign-up/upload-albums`);
  };

  const capturePhoto = () => {
    if (formPhoto) {
      setValue("photo", null);
    } else if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const arr = imageSrc.split(",");
        const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const file = new File([u8arr], "photo.png", { type: mime });

        setValue("photo", file);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-4/5 py-10 lg:w-2/5">
        <Card>
          <CardContent>
            <form
              id="upload-photo-form"
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Field>
                <FieldLabel>Photo</FieldLabel>
                <RadioGroup
                  onValueChange={(value: "Upload" | "Webcam") =>
                    setPhotoOption(value)
                  }
                  defaultValue={photoOption}
                  className="flex flex-wrap gap-4"
                  disabled={isPending}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Upload" id="Upload" />
                    <Label htmlFor="Upload">Upload</Label>
                  </div>
                  {hasCamera && (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Webcam" id="Webcam" />
                      <Label htmlFor="Webcam">Webcam</Label>
                    </div>
                  )}
                </RadioGroup>
              </Field>

              {photoOption === "Upload" && (
                <div className="flex flex-col gap-3">
                  <Input
                    ref={photoUploadRef}
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (file) {
                        if (file.size > 10 * 1024 * 1024) {
                          toast.error("File size exceeds 10MB limit");
                          e.target.value = "";
                          setValue("photo", null);
                          return;
                        }

                        setValue("photo", file);
                      }
                    }}
                    disabled={isPending}
                  />

                  {formPhoto && (
                    <div className="flex flex-col items-center gap-3">
                      <img
                        id="upload-preview"
                        alt="upload-preview"
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

                          setValue("photo", null);
                          if (photoUploadRef.current) {
                            photoUploadRef.current.value = "";
                          }
                        }}
                        disabled={isPending}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {photoOption === "Webcam" && (
                <div className="flex flex-col items-center gap-3">
                  {formPhoto ? (
                    <img
                      id="webcam-preview"
                      alt="webcam-preview"
                      width={300}
                      height={300}
                    />
                  ) : (
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      width={300}
                      height={300}
                    />
                  )}

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={capturePhoto}
                  >
                    {Boolean(formPhoto) ? "Retake" : "Capture"}
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
                form="upload-photo-form"
                size="2xl"
                disabled={isPending || !formPhoto}
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
