import { ReviewI } from "@/src/types/review.types";
import { AddressI } from "./maps.types";

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
  lastUpdate?: Date;
  vigils: VigilDetailsType[];
  getVigilsDetails: (
    vigils: VigilDetailsType["id"][],
    force?: boolean
  ) => Promise<VigilDetailsType[]>;
};
