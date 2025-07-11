export type ConsumerDetailsType = {
  displayName?: string;
  photoURL?: string;
  name?: string;
  surname?: string;
  email?: string;
  id: string;
  username?: string;
  other?: { [key: string]: string | number };
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
