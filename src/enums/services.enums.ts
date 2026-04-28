import Caffe from "@/components/svg/Caffe";
import { HeartIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { ComponentType, SVGProps } from "react";

export enum ServiceCatalogTypeEnum {
  COMPANIONSHIP = "companionship",
  LIGHT_ASSISTANCE = "light_assistance",
  MEDICAL_ASSISTANCE = "medical_assistance",
  HOUSE_KEEPING = "house_keeping",
  TRANSPORTATION = "transportation",
  SPECIALIZED_CARE = "specialized_care",
}

export const ServiceCatalogTypeLabels: Record<ServiceCatalogTypeEnum, string> =
  {
    [ServiceCatalogTypeEnum.COMPANIONSHIP]: "Compagnia",
    [ServiceCatalogTypeEnum.LIGHT_ASSISTANCE]: "Assistenza leggera",
    [ServiceCatalogTypeEnum.MEDICAL_ASSISTANCE]: "Assistenza medica",
    [ServiceCatalogTypeEnum.HOUSE_KEEPING]: "Pulizie e faccende domestiche",
    [ServiceCatalogTypeEnum.TRANSPORTATION]: "Trasporto e accompagnamento",
    [ServiceCatalogTypeEnum.SPECIALIZED_CARE]: "Assistenza specializzata",
  };

export const ServiceCatalogTypeIcons: Partial<
  Record<string, ComponentType<SVGProps<SVGSVGElement>>>
> = {
  company: Caffe,
  light_assistance: HeartIcon,
  specialized_care: UserGroupIcon,
};
