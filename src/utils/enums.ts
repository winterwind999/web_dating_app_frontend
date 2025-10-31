export const Gender = {
  MALE: "Male",
  FEMALE: "Female",
  NON_BINARY: "Non Binary",
  OTHER: "Other",
} as const;

export const AlbumType = {
  IMAGE: "Image",
  VIDEO: "Video",
} as const;

export const UserStatus = {
  ACTIVE: "Active",
  PAUSED: "Paused",
  BANNED: "Banned",
  DELETED: "Deleted",
} as const;

export const Role = {
  USER: "User",
  ADMIN: "Admin",
} as const;

export const ReportStatus = {
  PENDING: "Pending",
  UNDER_REVIEW: "Under Review",
  RESOLVED: "Resolved",
  DISMISSED: "Dismissed",
} as const;

export const ReportAction = {
  NO_ACTION: "No Action",
  WARNING_SENT: "Warning Sent",
  CONTENT_REMOVED: "Content Removed",
  ACCOUNT_SUSPENDED: "Account Suspended",
  ACCOUNT_BANNED: "Account Banned",
} as const;

export const Reason = {
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

export const ChatStatus = {
  SENDING: "Sending",
  SENT: "Sent",
  DELIVERED: "Delivered",
  SEEN: "Seen",
} as const;
