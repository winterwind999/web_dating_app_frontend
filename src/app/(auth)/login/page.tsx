"use client";

import { loginAction } from "@/actions/auth-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { BACKEND_URL } from "@/utils/constants";
import GoogleIcon from "@/utils/icons/GoogleIcon";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const formSchema = z.object({
  important: z.string(),
  email: z.email("Invalid Email Address").min(1, "This field is required"),
  password: z.string().min(1, "This field is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { handleSubmit, control, watch, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      important: "",
      email: "",
      password: "",
    },
  });
  const formImportant = watch("important");

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      toast.error(decodeURIComponent(error));
      router.replace("/login");
    }
  }, [searchParams, router]);

  const onSubmit = async (data: FormValues) => {
    if (formImportant) {
      return;
    }

    setIsPending(true);

    const res = await loginAction(data.email, data.password);

    if (res.statusCode >= 400) {
      setIsPending(false);
      toast.error(res.response);
      return;
    }

    setIsPending(false);
    reset();
    router.replace(`/feeds`);
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-4/5 py-10 lg:w-2/5">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button asChild>
                <Link href="/">Back</Link>
              </Button>
              <h3 className="font-semibold">Login</h3>
              <div className="w-16"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Controller
                    name="important"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="hidden"
                      >
                        <FieldLabel htmlFor="import-hp">
                          Important HP
                        </FieldLabel>
                        <Input
                          {...field}
                          id="import-hp"
                          aria-invalid={fieldState.invalid}
                          autoComplete="off"
                          disabled={isPending}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="email">Email Address</FieldLabel>
                        <Input
                          type="email"
                          {...field}
                          id="email"
                          aria-invalid={fieldState.invalid}
                          autoComplete="email"
                          disabled={isPending}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <div className="flex w-full items-center gap-2">
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                            id="password"
                            aria-invalid={fieldState.invalid}
                            autoComplete="off"
                            disabled={isPending}
                          />

                          {showPassword ? (
                            <EyeIcon
                              className="text-primary size-4 cursor-pointer"
                              onClick={() => setShowPassword((prev) => !prev)}
                            />
                          ) : (
                            <EyeOffIcon
                              className="text-primary size-4 cursor-pointer"
                              onClick={() => setShowPassword((prev) => !prev)}
                            />
                          )}
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Field
                    orientation="horizontal"
                    className="flex w-full items-center justify-center"
                  >
                    <Button
                      type="submit"
                      form="login-form"
                      size="2xl"
                      disabled={isPending}
                    >
                      {isPending && <Spinner />} SUBMIT
                    </Button>
                  </Field>
                </FieldGroup>
              </form>

              <p className="text-center">or</p>

              <div className="flex w-full items-center justify-center">
                <Button variant="ghost" size="2xl" asChild>
                  <Link href={`${BACKEND_URL}/auth/google/login`}>
                    <GoogleIcon />
                    <p>Login with Google</p>
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
