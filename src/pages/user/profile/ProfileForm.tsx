import { updateUserApi } from "@/apis/usersApi";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { cn } from "@/lib/utils";
import { INTERESTS } from "@/utils/constants";
import { Gender, UserStatus } from "@/utils/enums";
import { getCitiesByProvince, getProvinces } from "@/utils/philippines";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarIcon,
  CheckIcon,
  ChevronsUpDown,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const formSchema = z.object({
  firstName: z.string().min(1, "This field is required"),
  middleName: z.string().min(1, "This field is required"),
  lastName: z.string().min(1, "This field is required"),
  email: z.email("Invalid Email Address").min(1, "This field is required"),
  password: z
    .string()
    .optional()
    .superRefine((value, ctx) => {
      if (!value) {
        return;
      }

      const errors = [];

      if (value.length < 4) {
        errors.push("at least minimum 4 characters");
      }
      if (!/[a-z]/.test(value)) {
        errors.push("at least one lowercase letter");
      }
      if (!/[A-Z]/.test(value)) {
        errors.push("at least one uppercase letter");
      }
      if (!/\d/.test(value)) {
        errors.push("at least one number");
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        errors.push("at least one special character");
      }

      if (errors.length > 0) {
        ctx.addIssue({
          code: "custom",
          message: `Password must contain ${errors.join(", ")}.`,
        });
      }
    }),
  birthday: z.string().min(1, "This field is required"),
  gender: z.enum(Gender),
  address: z.object({
    street: z.string().optional(),
    city: z.string().min(1, "This field is required"),
    province: z.string().min(1, "This field is required"),
    country: z.string().min(1, "This field is required"),
  }),
  shortBio: z.string().min(1, "This field is required"),
  interests: z
    .array(z.string())
    .min(3, "At least three interests are required"),
  preferences: z
    .object({
      genderPreference: z.array(z.enum(Gender)),
      minAge: z
        .number()
        .min(18, "Minimum age is 18 years old")
        .max(100, "Maximum age is 100 years"),
      maxAge: z
        .number()
        .min(18, "Minimum age is 18 years old")
        .max(100, "Maximum age is 100 years"),
      maxDistance: z
        .number()
        .min(10, "Minimum is 1 kilometer")
        .max(100, "Maximum is 100 kilometer"),
    })
    .refine((prefs) => prefs.minAge <= prefs.maxAge, {
      message: "Minimum age cannot be greater than maximum age",
      path: ["minAge"],
    })
    .refine((prefs) => prefs.maxAge >= prefs.minAge, {
      message: "Maximum age cannot be less than minimum age",
      path: ["maxAge"],
    }),
  status: z.enum(UserStatus),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  user: User;
};

const ProfileForm = ({ user }: Props) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { sub } = useAuth();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [provinces, setProvinces] = useState<
    { province_name: string; province_key: string }[]
  >([]);
  const [cities, setCities] = useState<
    { city_name: string; city_key: string }[]
  >([]);
  const [provinceOpen, setProvinceOpen] = useState<boolean>(false);
  const [cityOpen, setCityOpen] = useState<boolean>(false);
  const [interestsOpen, setInterestsOpen] = useState<boolean>(false);

  const { handleSubmit, control, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      firstName: user.firstName ?? "",
      middleName: user.middleName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
      password: "",
      birthday: user.birthday ?? "",
      gender: user.gender ?? Gender.MALE,
      address: {
        street: user.address.street ?? "",
        city: user.address.city ?? "",
        province: user.address.province ?? "",
        country: "Philippines",
      },
      shortBio: user.shortBio ?? "",
      interests: user.interests ?? [],
      preferences: {
        genderPreference: user.preferences.genderPreference ?? [],
        minAge: user.preferences.minAge ?? 18,
        maxAge: user.preferences.maxAge ?? 100,
        maxDistance: user.preferences.maxDistance ?? 50,
      },
      status: user.status ?? UserStatus.ACTIVE,
    },
  });
  const selectedProvince = watch("address.province");

  useEffect(() => {
    getProvinces().then(setProvinces);
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      getCitiesByProvince(selectedProvince).then(setCities);
    } else {
      setCities([]);
    }
  }, [selectedProvince]);

  const { mutateAsync: updateUser, isPending } = useMutation({
    mutationFn: (formData: UpdateUserDto) =>
      updateUserApi(axiosPrivate, sub, formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["getUser"],
      });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: FormValues) => {
    await updateUser(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-4/5 py-10 lg:w-2/5">
        <Card>
          <CardContent>
            <form id="profile-form" onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                        <Input
                          {...field}
                          id="first-name"
                          aria-invalid={fieldState.invalid}
                          autoComplete="given-name"
                          disabled={isPending}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="middleName"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="middle-name">
                          Middle Name
                        </FieldLabel>
                        <Input
                          {...field}
                          id="middle-name"
                          aria-invalid={fieldState.invalid}
                          autoComplete="additional-name"
                          disabled={isPending}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                        <Input
                          {...field}
                          id="last-name"
                          aria-invalid={fieldState.invalid}
                          autoComplete="family-name"
                          disabled={isPending}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

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

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Controller
                    name="birthday"
                    control={control}
                    render={({ field, fieldState }) => {
                      const selectedDate = field.value
                        ? DateTime.fromFormat(
                            field.value,
                            "yyyy-MM-dd",
                          ).toJSDate()
                        : undefined;

                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="birthday">Birthday</FieldLabel>

                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className="w-[280px] justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate
                                  ? DateTime.fromJSDate(selectedDate).toFormat(
                                      "MMMM dd, yyyy",
                                    )
                                  : "Pick a date"}
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                captionLayout="dropdown"
                                selected={selectedDate}
                                onSelect={(date) => {
                                  if (date) {
                                    const formatted =
                                      DateTime.fromJSDate(date).toFormat(
                                        "yyyy-MM-dd",
                                      );
                                    field.onChange(formatted);
                                  } else {
                                    field.onChange("");
                                  }
                                }}
                                disabled={isPending}
                              />
                            </PopoverContent>
                          </Popover>

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      );
                    }}
                  />

                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>Gender</FieldLabel>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-wrap gap-4"
                          disabled={isPending}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={Gender.MALE} id="male" />
                            <Label htmlFor="male">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={Gender.FEMALE} id="female" />
                            <Label htmlFor="female">Female</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value={Gender.NON_BINARY}
                              id="non-binary"
                            />
                            <Label htmlFor="non-binary">Non Binary</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={Gender.OTHER} id="other" />
                            <Label htmlFor="other">Other</Label>
                          </div>
                        </RadioGroup>
                      </Field>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                  <Controller
                    name="address.street"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="street">Street</FieldLabel>
                        <Input
                          {...field}
                          id="street"
                          aria-invalid={fieldState.invalid}
                          autoComplete="street-address"
                          disabled={isPending}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="address.province"
                    control={control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>Province</FieldLabel>
                        <Popover
                          open={provinceOpen}
                          onOpenChange={setProvinceOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={provinceOpen}
                              className="w-[280px] justify-between"
                            >
                              {field.value || "Select province..."}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[280px] p-0">
                            <Command>
                              <CommandInput placeholder="Search province..." />
                              <CommandList>
                                <CommandEmpty>No province found.</CommandEmpty>
                                <CommandGroup>
                                  {provinces.map((p) => (
                                    <CommandItem
                                      key={p.province_key}
                                      value={p.province_name}
                                      onSelect={() => {
                                        if (isPending) {
                                          return;
                                        }
                                        field.onChange(p.province_name);
                                        setProvinceOpen(false);
                                      }}
                                    >
                                      {p.province_name}
                                      {p.province_name === field.value && (
                                        <CheckIcon className="ml-auto opacity-100" />
                                      )}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </Field>
                    )}
                  />

                  <Controller
                    name="address.city"
                    control={control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>City</FieldLabel>
                        <Popover open={cityOpen} onOpenChange={setCityOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={cityOpen}
                              className="w-[280px] justify-between"
                            >
                              {field.value || "Select city..."}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[280px] p-0">
                            <Command>
                              <CommandInput placeholder="Search city..." />
                              <CommandList>
                                <CommandEmpty>No city found.</CommandEmpty>
                                <CommandGroup>
                                  {cities.map((c) => (
                                    <CommandItem
                                      key={c.city_key}
                                      value={c.city_name}
                                      onSelect={() => {
                                        if (isPending) {
                                          return;
                                        }
                                        field.onChange(c.city_name);
                                        setCityOpen(false);
                                      }}
                                    >
                                      {c.city_name}
                                      {c.city_name === field.value && (
                                        <CheckIcon className="ml-auto opacity-100" />
                                      )}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </Field>
                    )}
                  />
                </div>

                <Controller
                  name="shortBio"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="shortBio">Short Bio</FieldLabel>
                      <Textarea
                        {...field}
                        id="shortBio"
                        placeholder="Tell us a bit about yourself..."
                        className="min-h-[100px]"
                        disabled={isPending}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="interests"
                  control={control}
                  render={({ field, fieldState }) => {
                    const handleToggle = (value: string) => {
                      if (isPending) {
                        return;
                      }
                      const newValue = field.value.includes(value)
                        ? field.value.filter((v) => v !== value)
                        : [...field.value, value];
                      field.onChange(newValue);
                    };

                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Interests</FieldLabel>
                        <Popover
                          open={interestsOpen}
                          onOpenChange={setInterestsOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={interestsOpen}
                              className="w-full justify-between"
                            >
                              <div className="flex flex-wrap gap-2 text-left">
                                {field.value.length > 0 ? (
                                  field.value.map((val, i) => (
                                    <div
                                      key={i}
                                      className="bg-secondary text-secondary-foreground rounded-xl border px-2 py-1 text-xs font-medium"
                                    >
                                      {INTERESTS.find((it) => it === val) ||
                                        val}
                                    </div>
                                  ))
                                ) : (
                                  <span>Select interests...</span>
                                )}
                              </div>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent className="w-[480px] p-0">
                            <Command>
                              <CommandInput placeholder="Search interest..." />
                              <CommandEmpty>No interests found.</CommandEmpty>
                              <CommandGroup>
                                <CommandList>
                                  {INTERESTS.map((interest) => (
                                    <CommandItem
                                      key={interest}
                                      value={interest}
                                      onSelect={() => handleToggle(interest)}
                                    >
                                      <CheckIcon
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value.includes(interest)
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                      {interest}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
                />

                <div className="flex flex-col gap-2">
                  <p>Preferences</p>

                  <Controller
                    name="preferences.genderPreference"
                    control={control}
                    render={({ field, fieldState }) => {
                      const toggleGender = (value: Gender) => {
                        const current = field.value || [];
                        const newValue = current.includes(value)
                          ? current.filter((g) => g !== value)
                          : [...current, value];
                        field.onChange(newValue);
                      };

                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Gender Preference</FieldLabel>
                          <div className="flex flex-wrap gap-4">
                            {Object.values(Gender).map((g) => (
                              <div key={g} className="flex items-center gap-2">
                                <Checkbox
                                  id={`pref-${g}`}
                                  checked={field.value.includes(g)}
                                  onCheckedChange={() => toggleGender(g)}
                                  disabled={isPending}
                                />
                                <Label htmlFor={`pref-${g}`}>
                                  {g.charAt(0).toUpperCase() +
                                    g.slice(1).replace("_", " ")}
                                </Label>
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

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Controller
                      name="preferences.minAge"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="min-age">Minimum Age</FieldLabel>
                          <Input
                            type="number"
                            {...field}
                            id="min-age"
                            min={18}
                            max={100}
                            aria-invalid={fieldState.invalid}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            disabled={isPending}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="preferences.maxAge"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="max-age">Maximum Age</FieldLabel>
                          <Input
                            type="number"
                            {...field}
                            id="max-age"
                            min={18}
                            max={100}
                            aria-invalid={fieldState.invalid}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            disabled={isPending}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  <Controller
                    name="preferences.maxDistance"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="max-distance">
                          Max Distance (km): {field.value}
                        </FieldLabel>
                        <Slider
                          id="max-distance"
                          value={[field.value]}
                          onValueChange={(val) => field.onChange(val[0])}
                          min={10}
                          max={100}
                          step={10}
                          disabled={isPending}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            <Field
              orientation="horizontal"
              className="flex w-full items-center justify-center"
            >
              <Button
                type="submit"
                form="profile-form"
                size="2xl"
                disabled={isPending}
              >
                {isPending && <Spinner />} SAVE CHANGES
              </Button>
            </Field>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProfileForm;
