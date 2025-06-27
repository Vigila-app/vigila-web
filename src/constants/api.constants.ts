import { isServer } from "@/src/utils/common.utils";
import { isMocked, isReleased } from "@/src/utils/envs.utils";
import { SupabaseConstants } from "@/src/constants/supabase.constants";
import { CmsContentType } from "@/src/enums/cms.enums";
import { AppConstants } from "@/src/constants";
import { ServiceI } from "@/src/types/services.types";
import { SaleI } from "@/src/types/sales.types";
import { GuestI } from "@/src/types/crm.types";
import { RolesEnum } from "../enums/roles.enums";

const checkIfIsMock = (isMock: boolean): boolean =>
  (isMock || isMocked) && !isReleased;

const apiRoot = {
  MOCKS: "http://localhost:3000",
  RELEASE: isServer
    ? isMocked
      ? "http://localhost:3000"
      : AppConstants.hostUrl
    : `${window.location.origin}`,
  FIRESTORE_DB: `https://firestore.googleapis.com/v1/projects/${SupabaseConstants.projectId}/databases/(default)/documents`,
};

const getEnv = (isMock: boolean) => {
  if (isReleased) {
    return apiRoot.RELEASE;
  }
  if (checkIfIsMock(isMock)) {
    return apiRoot.MOCKS;
  }
  return apiRoot.RELEASE;
};

const apiBase = {
  V1: (isMock = false) => `${getEnv(isMock)}/api/v1`,
};

const apiControllers = {
  // region CHECKOUT
  INTENT: (paymentIntentId?: string, isMock?: boolean): string =>
    `${apiBase.V1(isMock)}/payment/intent${
      paymentIntentId ? `/${paymentIntentId}` : ""
    }`,
  // endregion CHECKOUT

  // region CMS
  CONTENT: (
    contentType: CmsContentType,
    contentId: string,
    isMock?: boolean
  ): string => `${apiBase.V1(isMock)}/cms/${contentType}/${contentId}`,
  // endregion CMS

  // region CRM
  GUESTS: (isMock?: boolean): string =>
    `${apiBase.V1(isMock)}/crm/guests`,
  // endregion CRM

  // region MAPS
  POI: (isMock?: boolean): string => `${apiBase.V1(isMock)}/maps/poi/browse`,
  SEARCH_POI: (isMock?: boolean): string =>
    `${apiBase.V1(isMock)}/maps/poi/search`,
  VALIDATE_ADDRESS: (isMock?: boolean): string =>
    `${apiBase.V1(isMock)}/maps/address`,
  // endregion MAPS

  // region reCAPTCHA
  VALIDATE_RECAPTCHA: (isMock?: boolean): string =>
    `${apiBase.V1(isMock)}/validate-recaptcha`,
  // endregion reCAPTCHA

  // region SERVICES
  SERVICES: (isMock?: boolean): string => `${apiBase.V1(isMock)}/services`,
  // endregion SERVICES

  // region SALES
  SALES: (isMock?: boolean): string => `${apiBase.V1(isMock)}/sales`,
  // endregion SALES

  // region USER
  USER: (isMock?: boolean): string => `${apiBase.V1(isMock)}/user`,
  // endregion USER

// region ONBOARD
  ONBOARD: (isMock?: boolean): string => `${apiBase.V1(isMock)}/onboard`,
  // endregion ONBOARD
};

export const apiUser = {
  SIGNUP: (isMock?: boolean): string => `${apiControllers.USER(isMock)}/signup`,
  DETAILS: (id: string, role: RolesEnum, isMock?: boolean): string =>
    `${apiControllers.USER(isMock)}/${role?.toLowerCase()}/${isMock ? "user" : id}`,
  DELETE: (id: string, isMock?: boolean): string =>
    `${apiControllers.USER(isMock)}/${isMock ? "user" : id}`,
  DEVICES: (id: string, isMock?: boolean): string =>
    `${apiControllers.USER(isMock)}/devices/${id}`,
  TERMS: (id: string, isMock?: boolean): string =>
    `${apiControllers.USER(isMock)}/terms/${id}`,
};
export const apiOnboard={
  ONBOARD:(userId:string, role:RolesEnum,isMock?:boolean): string=>`${apiControllers.ONBOARD(isMock)}/${userId}/${role}`
}
export const apiServices = {
  CREATE: (isMock?: boolean): string => apiControllers.SERVICES(isMock),
  LIST: (isMock?: boolean): string => apiControllers.SERVICES(isMock),
  DETAILS: (serviceId: ServiceI["id"], isMock?: boolean): string =>
    `${apiControllers.SERVICES(isMock)}/${isMock ? "service" : serviceId}`,
};

export const apiCostumers = {
  CREATE: (isMock?: boolean): string => apiControllers.GUESTS(isMock),
  LIST: (isMock?: boolean): string => apiControllers.GUESTS(isMock),
  DETAILS: (guestId: GuestI["id"], isMock?: boolean): string =>
    `${apiControllers.GUESTS(isMock)}/${isMock ? "costumer" : guestId}`,
};

export const apiSales = {
  LIST: (isMock?: boolean): string => apiControllers.SALES(isMock),
  DETAILS: (saleId: SaleI["id"], isMock?: boolean): string =>
    `${apiControllers.SALES(isMock)}/${isMock ? "sale" : saleId}`,
};

export const apiRecaptcha = {
  VALIDATE: (isMock?: boolean): string =>
    apiControllers.VALIDATE_RECAPTCHA(isMock),
};

export const apiCms = {
  CONTENT: (
    contentType: CmsContentType,
    contentId: string,
    isMock?: boolean
  ): string => apiControllers.CONTENT(contentType, contentId, isMock),
  CONTENT_SSR: (pathToDocument: string) =>
    `${apiRoot.FIRESTORE_DB}/${pathToDocument}`,
};

export const apiMaps = {
  POI: (isMock?: boolean): string => apiControllers.POI(isMock),
  SEARCH_POI: (isMock?: boolean): string => apiControllers.SEARCH_POI(isMock),
  VALIDATE: (isMock?: boolean): string =>
    apiControllers.VALIDATE_ADDRESS(isMock),
};

export const apiCheckout = {
  INTENT: (paymentIntentId?: string, isMock?: boolean): string =>
    apiControllers.INTENT(paymentIntentId, isMock),
};
