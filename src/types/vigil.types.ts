import { ReviewI } from "@/src/types/review.types";

export type VigilDetailsType = {
  displayName?: string;
  photoURL?: string;
  name?: string;
  surname?: string;
  email?: string;
  id: string;
  username?: string;
  other?: { [key: string]: string | number };
  reviews?: ReviewI[];
  averageRating?: number;
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
