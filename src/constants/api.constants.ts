import { isServer } from "@/src/utils/common.utils";
import { isMocked, isReleased } from "@/src/utils/envs.utils";
import { SupabaseConstants } from "@/src/constants/supabase.constants";
import { CmsContentType } from "@/src/enums/cms.enums";
import { AppConstants } from "@/src/constants";
import { ServiceI } from "@/src/types/services.types";
import { BookingI } from "@/src/types/booking.types";
import { RolesEnum } from "@/src/enums/roles.enums";
import { VigilDetailsType } from "@/src/types/vigil.types";
import { ConsumerDetailsType } from "@/src/types/consumer.types";

const checkIfIsMock = (isMock: boolean): boolean =>
  (isMock || isMocked) && !isReleased;

const apiRoot = {
  MOCKS: "http://localhost:3000",
  RELEASE: isServer
    ? isMocked
      ? "http://localhost:3000"
      : AppConstants.hostUrl
    : `${window.location.origin}`,
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
  // region ADMIN
  ADMIN: (isMock?: boolean): string => `${apiBase.V1(isMock)}/admin`,
  // endregion ADMIN

  // region PAYMENT
  CREATE_PAYMENT_INTENT: (isMock?: boolean): string =>
    `${apiBase.V1(isMock)}/payment/create-payment-intent`,
  VERIFY_PAYMENT_INTENT: (isMock?: boolean): string =>
    `${apiBase.V1(isMock)}/payment/verify-payment-intent`,
  PAYMENT_INTENT: (paymentIntentId?: string, isMock?: boolean): string =>
    `${apiBase.V1(isMock)}/payment/intent${
      paymentIntentId ? `/${paymentIntentId}` : ""
    }`,
  // endregion PAYMENT

  // region CHECKOUT
  INTENT: (paymentIntentId?: string, isMock?: boolean): string =>
    `${apiBase.V1(isMock)}/payment/intent${
      paymentIntentId ? `/${paymentIntentId}` : ""
    }`,
  // endregion CHECKOUT

  // region WALLET
  WALLET_TOP_UP: (isMock?: boolean): string =>
    `${apiBase.V1(isMock)}/wallet/top-up`,
  PAY_BOOKING: (isMock?: boolean): string =>
    `${apiBase.V1(isMock)}/wallet/pay-booking`,
  TRANSACTIONS: (isMock?: boolean): string =>
    `${apiBase.V1(isMock)}/wallet/transactions/`,
  // endregion WALLET

  // region WEBHOOKS
  STRIPE_WEBHOOK: (isMock?: boolean): string =>
    `${apiBase.V1(isMock)}/webhooks/stripe`,
  // endregion WEBHOOKS

  // region CMS
  CONTENT: (
    contentType: CmsContentType,
    contentId: string,
    isMock?: boolean
  ): string => `${apiBase.V1(isMock)}/cms/${contentType}/${contentId}`,
  // endregion CMS

  // region CRM
  GUESTS: (isMock?: boolean): string => `${apiBase.V1(isMock)}/crm/guests`,
  // endregion CRM

  // region BOOKINGS
  BOOKINGS: (isMock?: boolean): string => `${apiBase.V1(isMock)}/bookings`,
  // endregion BOOKINGS

  // region MAPS
  POI: (isMock?: boolean): string => `${apiBase.V1(isMock)}/maps/poi/browse`,
  SEARCH_POI: (isMock?: boolean): string =>
    `${apiBase.V1(isMock)}/maps/poi/search`,
  VALIDATE_ADDRESS: (isMock?: boolean): string =>
    `${apiBase.V1(isMock)}/maps/address`,
  // endregion MAPS

  // region ALTCHA
  ALTCHA: (isMock?: boolean): string => `${apiBase.V1(isMock)}/altcha`,
  // endregion reCAPTCHA

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

  // region CONSUMER
  CONSUMER: (isMock?: boolean): string => `${apiBase.V1(isMock)}/consumer`,
  // endregion CONSUMER

  // region VIGIL
  VIGIL: (isMock?: boolean): string => `${apiBase.V1(isMock)}/vigil`,
  // endregion VIGIL

  // region REVIEWS
  REVIEWS: (isMock?: boolean): string => `${apiBase.V1(isMock)}/reviews`,
  // endregion REVIEWS

  // region EMAIL
  EMAIL: (isMock?: boolean): string => `${apiBase.V1(isMock)}/email`,
  // endregion EMAIL
};

export const apiUser = {
  SIGNUP: (isMock?: boolean): string => `${apiControllers.USER(isMock)}/signup`,
  COMPLETE_GOOGLE: (isMock?: boolean): string => `${apiControllers.USER(isMock)}/completeGoogle`,
  DETAILS: (id: string, role: RolesEnum, isMock?: boolean): string =>
    `${apiControllers.USER(isMock)}/${role?.toLowerCase()}/${
      isMock ? "user" : id
    }`,
  DELETE: (id: string, isMock?: boolean): string =>
    `${apiControllers.USER(isMock)}/${isMock ? "user" : id}`,
  DEVICES: (id: string, isMock?: boolean): string =>
    `${apiControllers.USER(isMock)}/devices/${id}`,
  TERMS: (id: string, isMock?: boolean): string =>
    `${apiControllers.USER(isMock)}/terms/${id}`,
};

export const apiAltcha = {
  CHALLENGE: (isMock?: boolean): string =>
    `${apiControllers.ALTCHA(isMock)}/challenge`,
  VALIDATE: (isMock?: boolean): string =>
    `${apiControllers.ALTCHA(isMock)}/validate`,
};

export const apiOnboard = {
  ONBOARD: (userId: string, role: RolesEnum, isMock?: boolean): string =>
    `${apiControllers.ONBOARD(isMock)}/${userId}/${role}`,
};
export const apiServices = {
  CREATE: (isMock?: boolean): string => apiControllers.SERVICES(isMock),
  LIST: (isMock?: boolean): string => apiControllers.SERVICES(isMock),
  DETAILS: (serviceId: ServiceI["id"], isMock?: boolean): string =>
    `${apiControllers.SERVICES(isMock)}/${isMock ? "service" : serviceId}`,
};

export const apiBookings = {
  CREATE: (isMock?: boolean): string => apiControllers.BOOKINGS(isMock),
  LIST: (isMock?: boolean): string => apiControllers.BOOKINGS(isMock),
  DETAILS: (bookingId: BookingI["id"], isMock?: boolean): string =>
    `${apiControllers.BOOKINGS(isMock)}/${isMock ? "booking" : bookingId}`,
  UPDATE_PAYMENT: (bookingId: BookingI["id"], isMock?: boolean): string =>
    `${apiControllers.BOOKINGS(isMock)}/${
      isMock ? "booking" : bookingId
    }/payment`,
};

export const apiPayment = {
  CREATE_INTENT: (isMock?: boolean): string =>
    apiControllers.CREATE_PAYMENT_INTENT(isMock),
  VERIFY_INTENT: (isMock?: boolean): string =>
    apiControllers.VERIFY_PAYMENT_INTENT(isMock),
  INTENT: (paymentIntentId?: string, isMock?: boolean): string =>
    apiControllers.PAYMENT_INTENT(paymentIntentId, isMock),
};

export const apiWallet = {
  TOP_UP: (isMock?: boolean): string => apiControllers.WALLET_TOP_UP(isMock),
  PAY_BOOKING: (isMock?: boolean): string => apiControllers.PAY_BOOKING(isMock),
  TRANSACTIONS: (isMock?: boolean): string =>
    apiControllers.TRANSACTIONS(isMock),
};

export const apiWebhooks = {
  STRIPE: (isMock?: boolean): string => apiControllers.STRIPE_WEBHOOK(isMock),
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

export const apiConsumer = {
  DETAILS: (consumerId: ConsumerDetailsType["id"], isMock?: boolean): string =>
    `${apiControllers.CONSUMER(isMock)}/${isMock ? "consumer" : consumerId}`,
};

export const apiVigil = {
  DETAILS: (vigilId: VigilDetailsType["id"], isMock?: boolean): string =>
    `${apiControllers.VIGIL(isMock)}/${isMock ? "vigil" : vigilId}`,
};

export const apiAdmin = {
  ANALYTICS: (isMock?: boolean): string =>
    `${apiControllers.ADMIN(isMock)}/analytics`,
  BOOKINGS: (isMock?: boolean): string =>
    `${apiControllers.ADMIN(isMock)}/bookings`,
  VIGILS: (isMock?: boolean): string =>
    `${apiControllers.ADMIN(isMock)}/vigils`,
  CONSUMERS: (isMock?: boolean): string =>
    `${apiControllers.ADMIN(isMock)}/consumers`,
  SERVICES: (isMock?: boolean): string =>
    `${apiControllers.ADMIN(isMock)}/services`,
  PAYMENTS: (isMock?: boolean): string =>
    `${apiControllers.ADMIN(isMock)}/payments`,
  PROMOTE_USER: (userId: string, isMock?: boolean): string =>
    `${apiControllers.ADMIN(isMock)}/users/${userId}/promote`,
};

export const apiReviews = {
  CREATE: (isMock?: boolean): string => apiControllers.REVIEWS(isMock),
  LIST: (isMock?: boolean): string => apiControllers.REVIEWS(isMock),
  LIST_BY_VIGIL: (vigilId: string, isMock?: boolean): string =>
    `${apiControllers.REVIEWS(isMock)}/vigil/${vigilId}`,
  BY_BOOKING: (bookingId: string, isMock?: boolean): string =>
    `${apiControllers.REVIEWS(isMock)}/booking/${bookingId}`,
  VIGIL_STATS: (vigilId: string, isMock?: boolean): string =>
    `${apiControllers.REVIEWS(isMock)}/vigil/${vigilId}/stats`,
  UPDATE: (reviewId: string, isMock?: boolean): string =>
    `${apiControllers.REVIEWS(isMock)}/${reviewId}`,
  DELETE: (reviewId: string, isMock?: boolean): string =>
    `${apiControllers.REVIEWS(isMock)}/${reviewId}`,
};

export const apiEmail = {
  SEND: (isMock?: boolean): string => apiControllers.EMAIL(isMock),
};
