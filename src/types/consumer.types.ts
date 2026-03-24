import { AddressI } from "@/src/types/maps.types";

export type ConsumerDataType = {
  id: string;
  consumer_id: string;
  created_at?: string;
  updated_at?: string;
  autonomy?: string;
  needs?: string[];
  gender_preference?: string;
  attitude?: string[];
  qualifications?: string;
  transportation?: string;
  experience?: string;
};

export type ConsumerDetailsType = {
  displayName?: string;
  photoURL?: string;
  name?: string;
  surname?: string;
  email?: string;
  id: string;
  username?: string;
  lovedOneName?: string;
  lovedOneAge?: string;
  lovedOneBirthday?: string;
  lovedOnePhone?: string;
  phone?: string;
  relationship?: string;
  information?: string;
  city?: string;
  created_at?: string;
  other?: { [key: string]: string | number };
  address?: AddressI;
};

export type ConsumerStoreType = {
  onLogout: () => void;
  lastUpdateDetails?: Date;
  lastUpdateData?: Date;
  consumers: ConsumerDetailsType[];
  consumersData: ConsumerDataType[];
  getConsumersDetails: (
    consumers: ConsumerDetailsType["id"][],
    force?: boolean,
  ) => Promise<ConsumerDetailsType[]>;
  getConsumerData: (
    consumerId: ConsumerDetailsType["id"],
    force?: boolean,
  ) => Promise<ConsumerDataType | null>;
};
