import { ServiceCatalogTypeEnum } from "@/src/enums/services.enums";

export type NoticeBoardI = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  postal_code: string;
  city?: string;
  service_type: string;
  status: "active" | "proposed" | "closed";
  vigil_id?: string;
  created_at: Date;
  updated_at?: Date;
};

export type NoticeBoardFormI = {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  postal_code: string;
  city?: string;
  service_type: ServiceCatalogTypeEnum;
};
