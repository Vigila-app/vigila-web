import { ReviewI } from "@/src/types/review.types";
import { AddressI } from "./maps.types";

export type VigilDataType = {
  id: string;
  vigil_id: string;
  created_at?: string;
  updated_at?: string;
  transportation_mode?: string;
  occupation?: string;
  courses?: string;
  experience_years?: string;
};

export type VigilDetailsType = {
  displayName?: string;
  verified?: boolean;
  photoURL?: string;
  name?: string;
  surname?: string;
  email?: string;
  id: string;
  phone?: string;
  information?: string;
  occupation?: string;
  username?: string;
  other?: { [key: string]: string | number };
  reviews?: ReviewI[];
  averageRating?: number;
  created_at?: string;
  updated_at?: string;
  status: string;
  address?: AddressI;
  birthday?: string;
  addresses?: {
    id: string;
    name: string;
    address: string;
    postalCode: string;
    city: string;
    province: string;
    country: string;
    display_name?: string;
  }[];
};

export type ViglStoreType = {
  onLogout: () => void;
  lastUpdateDetails?: Date;
  lastUpdateData?: Date;
  vigils: VigilDetailsType[];
  vigilsData: VigilDataType[];
  getVigilsDetails: (
    vigils: VigilDetailsType["id"][],
    force?: boolean,
  ) => Promise<VigilDetailsType[]>;
  getVigilData: (
    vigilId: VigilDetailsType["id"],
    force?: boolean,
  ) => Promise<VigilDataType | null>;
};
