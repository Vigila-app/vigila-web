import { AddressI } from "@/src/types/maps.types";

export type ConsumerDetailsType = {
  displayName?: string;
  photoURL?: string;
  name?: string;
  surname?: string;
  email?: string;
  id: string;
  username?: string;
  lovedOneName?:string;
  lovedOneAge?:string;
  lovedOneBirthday?:string;
  lovedOnePhone?:string;
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
  lastUpdate?: Date;
  consumers: ConsumerDetailsType[];
  getConsumersDetails: (
    consumers: ConsumerDetailsType["id"][],
    force?: boolean
  ) => Promise<ConsumerDetailsType[]>;
};
