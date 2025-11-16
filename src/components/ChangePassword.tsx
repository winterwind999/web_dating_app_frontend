import { changePasswordAction } from "@/actions/auth-action";
import { useUserStore } from "@/stores/user-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import { Button } from "./ui/button";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";

const formSchema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    const errors = [];

    if (data.password.trim().length === 0) {
      errors.push("This field is required.");
    }

    if (data.password.length < 7) {
      errors.push(`Minimum length is ${7}`);
    }

    if (!/[a-z]/.test(data.password)) {
      errors.push("Must have at least one lowercase letter.");
    }

    if (!/[A-Z]/.test(data.password)) {
      errors.push("Must have at least one uppercase letter.");
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(data.password)) {
      errors.push("Must have at least one symbol.");
    }

    if (errors.length > 0) {
      ctx.addIssue({
        code: "custom",
        message: errors.join("\n"),
        path: ["password"],
      });
    }
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function ChangePassword() {
  const { setEmail } = useUserStore();
  const email = useUserStore((state) => state.email);

  const [isPending, setIsPending] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [enableClose, setEnableClose] = useState<boolean>(false);

  const { handleSubmit, control, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (data.password !== data.confirmPassword) {
      toast.error(`Passwords don't match`);
      return;
    }

    setIsPending(true);

    const res = await changePasswordAction(email, data.password);

    if (res.statusCode >= 400) {
      setIsPending(false);
      toast.error(res.response);
      return;
    }

    toast.success("Successfully changed password");
    setEnableClose(true);
    setIsPending(false);
  };

  return (
    <form
      id="change-password-form"
      className="flex flex-col gap-3"
      onSubmit={handleSubmit(onSubmit)}
    >
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
                disabled={enableClose || isPending}
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
            <div className="flex w-full items-center gap-2">
              <Input
                type={showPassword ? "text" : "password"}
                {...field}
                id="confirm-password"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                disabled={enableClose || isPending}
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Field
        orientation="horizontal"
        className="flex w-full items-center justify-center"
      >
        <Button
          type="submit"
          form="change-password-form"
          size="2xl"
          disabled={enableClose || isPending}
        >
          {isPending && <Spinner />} SUBMIT
        </Button>
      </Field>

      {enableClose && (
        <p className="text-center">You may now close this modal.</p>
      )}
    </form>
  );
}
