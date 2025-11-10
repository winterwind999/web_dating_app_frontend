export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://matchy-api-h0c4.onrender.com";

export const CSRF_COOKIE: string =
  process.env.NEXT_PUBLIC_APP_ENV === "production"
    ? "__Host-psifi.x-csrf-token"
    : "psifi.x-csrf-token";

export const CSRF_HEADER: string = "x-csrf-token";

export const STACK_IMAGES: { id: number; img: string }[] = [
  { id: 1, img: "/assets/jorge-fakhouri-filho-pexels.jpg" },
  { id: 2, img: "/assets/gemini-guy-2.png" },
  { id: 3, img: "/assets/amin-naderloei-unsplash.jpg" },
  { id: 4, img: "/assets/gemini-guy-1.png" },
  { id: 5, img: "/assets/emily-lau-unsplash.jpg" },
];

export const INTERESTS: string[] = [
  "Traveling",
  "Cooking",
  "Reading",
  "Music",
  "Movies",
  "Fitness",
  "Dancing",
  "Gaming",
  "Art",
  "Photography",
  "Hiking",
  "Sports",
  "Yoga",
  "Writing",
  "Technology",
  "Pets",
  "Fashion",
  "Volunteering",
  "Food Trips",
  "Meditation",
];

export const GENDERS = {
  MALE: "Male",
  FEMALE: "Female",
  NON_BINARY: "Non Binary",
  OTHER: "Other",
} as const;
export type Gender = (typeof GENDERS)[keyof typeof GENDERS];

export const ALBUM_TYPES = {
  IMAGE: "Image",
  VIDEO: "Video",
} as const;
export type AlbumType = (typeof ALBUM_TYPES)[keyof typeof ALBUM_TYPES];

export type Album = {
  id: string;
  public_id: string;
  secure_url: string;
  type: AlbumType;
  sortOrder: number;
};

export const USER_STATUSES = {
  ACTIVE: "Active",
  PAUSED: "Paused",
  BANNED: "Banned",
} as const;
export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES];

export const USER_ROLES = {
  USER: "User",
  ADMIN: "Admin",
} as const;
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export type Photo = {
  public_id: string | null;
  secure_url: string | null;
};

export type Address = {
  street?: string;
  city: string;
  province: string;
  country: string;
  coordinates: number[];
};

export type Preferences = {
  genderPreference: Gender[];
  minAge: number;
  maxAge: number;
  maxDistance: number;
};

export const REPORT_REASONS = {
  HARASSMENT: "Harassment",
  SUICIDE_OR_SELF_INJURY: "Suicide or self-injury",
  VIOLENCE: "Violence or dangerous organizations",
  NUDITY: "Nudity or sexual activity",
  SELLING: "Selling or promoting restricted items",
  SCAM_OR_FRAUD: "Scam or fraud",
  BLACKMAIL: "Blackmail",
  IDENTITY_THEFT: "Identity Theft",
  OTHER: "Other",
} as const;
export type ReportReason = (typeof REPORT_REASONS)[keyof typeof REPORT_REASONS];

export const REPORT_STATUSES = {
  PENDING: "Pending",
  UNDER_REVIEW: "Under Review",
  RESOLVED: "Resolved",
  DISMISSED: "Dismissed",
} as const;
export type ReportStatus =
  (typeof REPORT_STATUSES)[keyof typeof REPORT_STATUSES];

export const REPORT_ACTIONS = {
  NO_ACTION: "No Action",
  WARNING_SENT: "Warning Sent",
  CONTENT_REMOVED: "Content Removed",
  ACCOUNT_SUSPENDED: "Account Suspended",
  ACCOUNT_BANNED: "Account Banned",
} as const;
export type ReportAction = (typeof REPORT_ACTIONS)[keyof typeof REPORT_ACTIONS];

export const CHAT_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  GIF: "gif",
  STICKER: "sticker",
} as const;
export type ChatType = (typeof CHAT_TYPES)[keyof typeof CHAT_TYPES];

export const CHAT_STATUSES = {
  SENDING: "Sending",
  SENT: "Sent",
  DELIVERED: "Delivered",
  SEEN: "Seen",
} as const;
export type ChatStatus = (typeof CHAT_STATUSES)[keyof typeof CHAT_STATUSES];

export type NavbarItem = {
  label: string;
  link: string;
};

export type User = {
  _id: string;
  photo: Photo | null;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  password: string;
  birthday: string;
  gender: Gender;
  shortBio: string;
  address: Address;
  interests: string[];
  preferences: Preferences;
  albums: Album[];
  status: UserStatus;
  role: UserRole;
  warningCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserDto = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  password: string;
  birthday: string;
  gender: Gender;
  shortBio: string;
  address: Omit<Address, "coordinates">;
  interests: string[];
  preferences: Preferences;
  status: UserStatus;
};

export type UpdateUserDto = Omit<CreateUserDto, "password"> & {
  password?: string;
};

export type Province = {
  name: string;
  region: string;
  key: string;
};

export type City = {
  name: string;
  province: string;
  city?: boolean;
};

export type Match = {
  _id: string;
  user: string | User;
  matchedUser: string | User;
  createdAt: string;
  updatedAt: string;
};

export type Chat = {
  _id: string;
  match: string;
  senderUser: string | User;
  receiverUser: string | User;
  content: string;
  type: ChatType;
  status: ChatStatus;
  createdAt: string;
  updatedAt: string;
};

export type ChatPayload = {
  match: string;
  senderUser: string;
  receiverUser: string;
  content: string;
  type: ChatType;
  status: ChatStatus;
};

export type Notification = {
  _id: string;
  user: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NotificationPayload = {
  user: string;
  message: string;
  isRead: boolean;
};
