import { GenderEnum } from "@/src/enums/common.enums";
import { AccessLevelsEnum, RolesEnum } from "@/src/enums/roles.enums";
import { UserMetadata } from "@supabase/supabase-js";

export type UserDetailsType = {
  displayName?: string;
  photoURL?: string;
  name?: string;
  surname?: string;
  email?: string;
  email_verified?: boolean;
  username?: string;
  birthday?: string;
  gender?: GenderEnum;
  phone?:string;
  other?: { [key: string]: string | number };
  role?: RolesEnum;
};

export type UserDevicesType = {
  [key: string]: {
    active: boolean;
    deviceId: string;
    lastUpdate?: Date | string;
    name?: string;
    platform?: string;
  };
};

export type UserTermsType = {
  [term: string]: boolean;
};

export type UserClaimsType = {
  role: RolesEnum;
  level: AccessLevelsEnum;
};

export type UserType = {
    created_at:string;
  email: string;
  id: string;
  displayName?: string;
  photoURL?: string;
      phone:string;
  user_metadata?: UserMetadata;
};

export type UserSignupType = UserType & {
  id?: string;
  name: string;
  surname: string;
  password: string;
  terms: UserTermsType;
  role: RolesEnum;
  level: AccessLevelsEnum;
};

export type UserStoreType = {
  onLogout: () => void;
  lastUpdate?: Date;
  user?: UserType;
  userDetails?: UserDetailsType;
  userDevices?: UserDevicesType;
  userTerms?: UserTermsType;
  setUser: ({
    user,
    userDetails,
    userTerms,
    userDevices,
  }: {
    user?: UserType;
    userDetails?: UserDetailsType;
    userTerms?: UserTermsType;
    userDevices?: UserDevicesType;
  }) => void;
  getUserDetails: (force?: boolean) => Promise<UserDetailsType>;
  getUserTerms: (force?: boolean) => Promise<UserTermsType>;
  getUserDevices: (force?: boolean) => Promise<UserDevicesType>;
  forceUpdate: () => void;
};
