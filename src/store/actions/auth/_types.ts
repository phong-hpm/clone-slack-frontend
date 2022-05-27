import { UserType, TeamType } from "store/slices/_types";

// login.tsx -----------------
export interface LoginPostData {
  email: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: UserType;
  teams: TeamType[];
}

// renewToken.tsx -----------------
export interface RenewAccessTokenResponseData {
  refreshToken: string;
  accessToken: string;
}

// getUserInformation.tsx -----------------
export interface UserResponseData extends UserType {
  teams: TeamType[];
}

export interface GetUserInformationResponseData {
  user: UserResponseData;
}

// verify.tsx -----------------
export interface VerifyResponseData {
  verified: boolean;
  user: UserType;
  teams: TeamType[];
}
