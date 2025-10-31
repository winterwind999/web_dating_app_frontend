type ApiErrorType = {
  response?: {
    data?: {
      response?: {
        message: string[];
      };
    };
    statusCode?: number;
  };
  message: string;
};

type User = {
  _id: string;
  photo: Photo;
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
  status: Status;
  role: string;
  warningCount: number;
};

type Photo = {
  public_id: string;
  secure_url: string;
};

type Album = {
  id: string;
  public_id: string;
  secure_url: string;
  type: AlbumType;
  sortOrder: number;
};

type AlbumType = "Image" | "Video";

type Preferences = {
  genderPreference: Gender[];
  minAge: number;
  maxAge: number;
  maxDistance: number;
};

type Gender = "Male" | "Female" | "Non Binary" | "Other";

type Address = {
  street?: string;
  city: string;
  province: string;
  country: string;
  coordinates: number[];
};

type UserStatus = "Active" | "Paused" | "Banned" | "Deleted";

type CreateUserDto = {
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

type UpdateUserDto = Omit<CreateUserDto, "password"> & {
  password?: string;
};

type Province = {
  name: string;
  region: string;
  key: string;
};

type City = {
  name: string;
  province: string;
  city?: boolean;
};

type CreateLikeDto = {
  user: string;
  likedUser: string;
};

type CreateDislikeDto = {
  user: string;
  dislikedUser: string;
};
