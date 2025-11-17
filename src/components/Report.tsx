"use client";

import { createReportAction } from "@/actions/reports-action";
import {
  CreateReportDto,
  REPORT_REASONS,
  ReportReason,
  User,
} from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlertIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Label } from "./ui/label";
import { Spinner } from "./ui/spinner";
import { Textarea } from "./ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const formSchema = z.object({
  reasons: z.array(z.enum(Object.values(REPORT_REASONS))),
  description: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  user: User;
};

export default function Report({ user }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const { handleSubmit, control } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      reasons: [],
      description: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsPending(true);

    const createReportDto: Omit<CreateReportDto, "user"> = {
      reportedUser: user._id,
      reasons: data.reasons,
      description: data.description,
      status: "Pending",
    };

    const res = await createReportAction(createReportDto);

    if (res.statusCode >= 400) {
      setIsPending(false);
      toast.error(res.response);
      return;
    }

    toast.success(res.message);
    setIsPending(false);
    setOpen(false);
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              className="h-10 w-10 rounded-full bg-yellow-500 hover:bg-yellow-500/70"
            >
              <TriangleAlertIcon />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to report {user.firstName} {user.lastName}
                ?
              </DialogTitle>
            </DialogHeader>

            <form
              id="report-form"
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="reasons"
                control={control}
                render={({ field, fieldState }) => {
                  const toggleReportReason = (value: ReportReason) => {
                    const current = field.value || [];
                    const newValue = current.includes(value)
                      ? current.filter((g) => g !== value)
                      : [...current, value];
                    field.onChange(newValue);
                  };

                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Reasons</FieldLabel>
                      <div className="flex flex-wrap gap-4">
                        {Object.entries(REPORT_REASONS).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <Checkbox
                              id={key}
                              checked={field.value.includes(value)}
                              onCheckedChange={() => toggleReportReason(value)}
                              disabled={isPending}
                            />
                            <Label htmlFor={key}>{value}</Label>
                          </div>
                        ))}
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />

              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="description">
                      Description{" "}
                      <span className="text-muted-foreground">
                        (max length of 350 characters)
                      </span>
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="description"
                      placeholder="Give more context for the report"
                      className="resize-none"
                      rows={4}
                      maxLength={350}
                      disabled={isPending}
                      onChange={(e) => {
                        let value = e.target.value;

                        const lines = value.split("\n");
                        if (lines.length > 4) {
                          value = lines.slice(0, 4).join("\n");
                        }

                        field.onChange(value);
                      }}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </form>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  CLOSE
                </Button>
              </DialogClose>

              <Button
                type="submit"
                form="report-form"
                variant="destructive"
                disabled={isPending}
              >
                {isPending ? <Spinner /> : "REPORT"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TooltipTrigger>
      <TooltipContent>Report</TooltipContent>
    </Tooltip>
  );
}
