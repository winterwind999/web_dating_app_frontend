"use client";

import { verifyEmailAction, verifyOtpAction } from "@/actions/auth-action";
import { useUserStore } from "@/stores/user-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import { Button } from "./ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { Spinner } from "./ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const formSchema = z.object({
  important: z.string(),
  email: z.email("Invalid Email Address").min(1, "Email Address is required"),
  otp: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  setShowComponent: Dispatch<
    SetStateAction<"Forgot Password" | "Change Password">
  >;
};

export default function ForgotPassword({ setShowComponent }: Props) {
  const { setEmail } = useUserStore();

  const [enableOtp, setEnableOtp] = useState<boolean>(false);
  const [enableNext, setEnableNext] = useState<boolean>(false);
  const [status, setStatus] = useState<"Verified" | "Incorrect" | null>(null);
  const [isPendingVerifyEmail, setIsPendingVerifyEmail] =
    useState<boolean>(false);
  const [isPendingVerifyOtp, setIsPendingVerifyOtp] = useState<boolean>(false);

  const { watch, control } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      important: "",
      email: "",
      otp: "",
    },
  });
  const formImportant = watch("important");
  const formEmail = watch("email");
  const formOtp = watch("otp");

  useEffect(() => {
    const onVerifyOtp = async () => {
      setIsPendingVerifyOtp(true);

      const res = await verifyOtpAction(formEmail, formOtp);

      if (res.statusCode >= 400) {
        setStatus("Incorrect");
        setIsPendingVerifyOtp(false);
        toast.error(res.response);
        return;
      }

      toast.success("Email Address Verified");
      setEmail(formEmail);
      setStatus("Verified");
      setEnableNext(true);
      setIsPendingVerifyOtp(false);
    };

    if (formOtp.length === 6) {
      onVerifyOtp();
    }
  }, [formOtp]);

  const onVerifyEmail = async () => {
    if (formImportant || !formEmail) {
      return;
    }

    setIsPendingVerifyEmail(true);

    const res = await verifyEmailAction(formEmail);

    if (res.statusCode >= 400) {
      setIsPendingVerifyEmail(false);
      toast(res.response);
      return;
    }

    toast("If the Email Address exists, an OTP has been sent");
    setEnableOtp(true);
    setIsPendingVerifyEmail(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <Controller
        name="important"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="hidden">
            <FieldLabel htmlFor="import-hp">Important HP</FieldLabel>
            <Input
              {...field}
              id="import-hp"
              aria-invalid={fieldState.invalid}
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>

            <div className="flex items-center gap-3">
              <Input
                type="email"
                {...field}
                id="email"
                aria-invalid={fieldState.invalid}
                autoComplete="email"
                disabled={isPendingVerifyEmail || isPendingVerifyOtp}
              />
              <Button
                type="button"
                onClick={onVerifyEmail}
                disabled={enableOtp}
              >
                {isPendingVerifyEmail && <Spinner />} SEND OTP
              </Button>
            </div>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="otp"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>OTP</FieldLabel>

            <div className="flex items-center gap-3">
              <InputOTP
                {...field}
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                aria-invalid={fieldState.invalid}
                disabled={
                  !enableOtp || isPendingVerifyEmail || isPendingVerifyOtp
                }
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {status !== null && (
                <Tooltip>
                  <TooltipTrigger>
                    {isPendingVerifyOtp ? (
                      <p>Pending</p>
                    ) : status === "Verified" ? (
                      <CheckCircleIcon className="text-green-700" />
                    ) : (
                      <XCircleIcon className="text-destructive" />
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    {isPendingVerifyOtp ? (
                      <Spinner />
                    ) : status === "Verified" ? (
                      <p>OTP Verified</p>
                    ) : (
                      <p>OTP Incorrect</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            <FieldDescription>
              Please enter the OTP sent to your email address. If you don’t see
              it in your inbox, kindly check your spam or junk folder.
            </FieldDescription>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="flex w-full justify-end">
        <Button
          onClick={() => setShowComponent("Change Password")}
          disabled={!enableNext}
        >
          NEXT
        </Button>
      </div>
    </div>
  );
}
