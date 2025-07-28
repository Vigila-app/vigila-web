import { ErrorI } from "@/src/types/error.types";

export const ResponseCodesConstants: { [key: string]: ErrorI } = {
  GENERIC_ERROR: {
    code: 1001,
  },

  // region ALTCHA
  ALTCHA_CHALLENGE_SUCCESS: {
    code: 8001,
  },
  ALTCHA_CHALLENGE_ERROR: {
    code: 8002,
  },
  ALTCHA_CHALLENGE_BAD_REQUEST: {
    code: 8003,
  },
  ALTCHA_CHALLENGE_METHOD_NOT_ALLOWED: {
    code: 8006,
  },
  ALTCHA_VALIDATE_SUCCESS: {
    code: 8011,
  },
  ALTCHA_VALIDATE_ERROR: {
    code: 8012,
  },
  ALTCHA_VALIDATE_BAD_REQUEST: {
    code: 8013,
  },
  ALTCHA_VALIDATE_METHOD_NOT_ALLOWED: {
    code: 8016,
  },
  // endregion ALTCHA

  // region PAYMENT
  PAYMENT_INTENT_SUCCESS: {
    code: 8101,
  },
  PAYMENT_INTENT_ERROR: {
    code: 8102,
  },
  PAYMENT_INTENT_BAD_REQUEST: {
    code: 8103,
  },
  PAYMENT_INTENT_UNAUTHORIZED: {
    code: 8104,
  },
  PAYMENT_INTENT_NOT_FOUND: {
    code: 8105,
  },
  PAYMENT_INTENT_ALREADY_PAID: {
    code: 8106,
  },
  PAYMENT_INTENT_METHOD_NOT_ALLOWED: {
    code: 8107,
  },

  PAYMENT_WEBHOOK_SUCCESS: {
    code: 8201,
  },
  PAYMENT_WEBHOOK_ERROR: {
    code: 8202,
  },
  PAYMENT_WEBHOOK_BAD_REQUEST: {
    code: 8203,
  },
  PAYMENT_WEBHOOK_UNMANAGED: {
    code: 8204,
  },
  PAYMENT_WEBHOOK_UNAUTHORIZED: {
    code: 8205,
  },
  PAYMENT_WEBHOOK_METHOD_NOT_ALLOWED: {
    code: 8206,
  },
  PAYMENT_WEBHOOK_METHOD_NOT_FOUND: {
    code: 8207,
  },
  // endregion PAYMENT

  // region CMS
  CMS_CONTENT_SUCCESS: {
    code: 6001,
  },
  CMS_CONTENT_ERROR: {
    code: 6002,
  },
  CMS_CONTENT_BAD_REQUEST: {
    code: 6003,
  },
  CMS_CONTENT_METHOD_NOT_ALLOWED: {
    code: 6006,
  },
  // endregion CMS

  // region CRM
  CUSTOMERS_CREATE_SUCCESS: {
    code: 6501,
  },
  CUSTOMERS_CREATE_ERROR: {
    code: 6502,
  },
  CUSTOMERS_CREATE_BAD_REQUEST: {
    code: 6503,
  },
  CUSTOMERS_CREATE_UNAUTHORIZED: {
    code: 6504,
  },
  CUSTOMERS_CREATE_FORBIDDEN: {
    code: 6505,
  },
  CUSTOMERS_CREATED_METHOD_NOT_ALLOWED: {
    code: 6506,
  },
  CUSTOMERS_CREATE_SERVICE_UNAVAILABLE: {
    code: 6507,
  },

  CUSTOMERS_DETAILS_SUCCESS: {
    code: 6601,
  },
  CUSTOMERS_DETAILS_ERROR: {
    code: 6602,
  },
  CUSTOMERS_DETAILS_BAD_REQUEST: {
    code: 6603,
  },
  CUSTOMERS_DETAILS_UNAUTHORIZED: {
    code: 6604,
  },
  CUSTOMERS_DETAILS_FORBIDDEN: {
    code: 6605,
  },
  CUSTOMERS_DETAILS_METHOD_NOT_ALLOWED: {
    code: 6606,
  },
  CUSTOMERS_DETAILS_NOT_FOUND: {
    code: 6607,
  },
  CUSTOMERS_DETAILS_SERVICE_UNAVAILABLE: {
    code: 6608,
  },
  // endregion CRM

  // region BOOKINGS
  BOOKINGS_CREATE_SUCCESS: {
    code: 9501,
  },
  BOOKINGS_CREATE_ERROR: {
    code: 9502,
  },
  BOOKINGS_CREATE_BAD_REQUEST: {
    code: 9503,
  },
  BOOKINGS_CREATE_UNAUTHORIZED: {
    code: 9504,
  },
  BOOKINGS_CREATE_FORBIDDEN: {
    code: 9505,
  },
  BOOKINGS_CREATE_METHOD_NOT_ALLOWED: {
    code: 9506,
  },
  BOOKINGS_CREATE_SERVICE_UNAVAILABLE: {
    code: 9507,
  },

  BOOKINGS_DETAILS_SUCCESS: {
    code: 9601,
  },
  BOOKINGS_DETAILS_ERROR: {
    code: 9602,
  },
  BOOKINGS_DETAILS_BAD_REQUEST: {
    code: 9603,
  },
  BOOKINGS_DETAILS_UNAUTHORIZED: {
    code: 9604,
  },
  BOOKINGS_DETAILS_FORBIDDEN: {
    code: 9605,
  },
  BOOKINGS_DETAILS_METHOD_NOT_ALLOWED: {
    code: 9606,
  },
  BOOKINGS_DETAILS_NOT_FOUND: {
    code: 9607,
  },
  BOOKINGS_DETAILS_SERVICE_UNAVAILABLE: {
    code: 9608,
  },

  BOOKINGS_UPDATE_SUCCESS: {
    code: 9631,
  },
  BOOKINGS_UPDATE_ERROR: {
    code: 9632,
  },
  BOOKINGS_UPDATE_BAD_REQUEST: {
    code: 9633,
  },
  BOOKINGS_UPDATE_UNAUTHORIZED: {
    code: 9634,
  },
  BOOKINGS_UPDATE_FORBIDDEN: {
    code: 9635,
  },
  BOOKINGS_UPDATE_METHOD_NOT_ALLOWED: {
    code: 9636,
  },
  BOOKINGS_UPDATE_NOT_FOUND: {
    code: 9637,
  },
  BOOKINGS_UPDATE_SERVICE_UNAVAILABLE: {
    code: 9638,
  },
  // endregion BOOKINGS

  // region MAPS
  MAPS_ADDRESS_SUCCESS: {
    code: 4001,
  },
  MAPS_ADDRESS_ERROR: {
    code: 4002,
  },
  MAPS_ADDRESS_BAD_REQUEST: {
    code: 4003,
  },
  MAPS_ADDRESS_METHOD_NOT_ALLOWED: {
    code: 4006,
  },

  MAPS_POI_BROWSE_SUCCESS: {
    code: 4011,
  },
  MAPS_POI_BROWSE_ERROR: {
    code: 4012,
  },
  MAPS_POI_BROWSE_BAD_REQUEST: {
    code: 4013,
  },
  MAPS_POI_BROWSE_METHOD_NOT_ALLOWED: {
    code: 4016,
  },

  MAPS_POI_SEARCH_SUCCESS: {
    code: 4011,
  },
  MAPS_POI_SEARCH_ERROR: {
    code: 4012,
  },
  MAPS_POI_SEARCH_BAD_REQUEST: {
    code: 4013,
  },
  MAPS_POI_SEARCH_METHOD_NOT_ALLOWED: {
    code: 4016,
  },
  // endregion MAPS

  // region reCAPTCHA
  RECAPTCHA_VALIDATE_SUCCESS: {
    code: 7001,
  },
  RECAPTCHA_VALIDATE_ERROR: {
    code: 7002,
  },
  RECAPTCHA_VALIDATE_BAD_REQUEST: {
    code: 7003,
  },
  RECAPTCHA_VALIDATE_METHOD_NOT_ALLOWED: {
    code: 7006,
  },
  // endregion reCAPTCHA

  // region USER
  USER_DETAILS_SUCCESS: {
    code: 2001,
  },
  USER_DETAILS_ERROR: {
    code: 2002,
  },
  USER_DETAILS_BAD_REQUEST: {
    code: 2003,
  },
  USER_DETAILS_UNAUTHORIZED: {
    code: 2004,
  },
  USER_DETAILS_FORBIDDEN: {
    code: 2005,
  },
  USER_DETAILS_METHOD_NOT_ALLOWED: {
    code: 2006,
  },

  USER_DELETE_SUCCESS: {
    code: 2901,
  },
  USER_DELETE_ERROR: {
    code: 2902,
  },
  USER_DELETE_BAD_REQUEST: {
    code: 2903,
  },
  USER_DELETE_UNAUTHORIZED: {
    code: 2904,
  },
  USER_DELETE_FORBIDDEN: {
    code: 2905,
  },
  USER_DELETE_METHOD_NOT_ALLOWED: {
    code: 2906,
  },

  USER_TERMS_SUCCESS: {
    code: 2101,
  },
  USER_TERMS_ERROR: {
    code: 2102,
  },
  USER_TERMS_BAD_REQUEST: {
    code: 2103,
  },
  USER_TERMS_UNAUTHORIZED: {
    code: 2104,
  },
  USER_TERMS_FORBIDDEN: {
    code: 2105,
  },
  USER_TERMS_METHOD_NOT_ALLOWED: {
    code: 2106,
  },

  USER_DEVICES_SUCCESS: {
    code: 2201,
  },
  USER_DEVICES_ERROR: {
    code: 2202,
  },
  USER_DEVICES_BAD_REQUEST: {
    code: 2203,
  },
  USER_DEVICES_UNAUTHORIZED: {
    code: 2204,
  },
  USER_DEVICES_FORBIDDEN: {
    code: 2205,
  },
  USER_DEVICES_METHOD_NOT_ALLOWED: {
    code: 2206,
  },

  USER_SIGNUP_SUCCESS: {
    code: 2901,
  },
  USER_SIGNUP_ERROR: {
    code: 2902,
  },
  USER_SIGNUP_BAD_REQUEST: {
    code: 2903,
  },
  USER_SIGNUP_UNAUTHORIZED: {
    code: 2904,
  },
  USER_SIGNUP_FORBIDDEN: {
    code: 2905,
  },
  USER_SIGNUP_METHOD_NOT_ALLOWED: {
    code: 2906,
  },
  USER_SIGNUP_SERVICE_UNAVAILABLE: {
    code: 2907,
  },
  // endregion USER

  // region SERVICES
  SERVICES_CREATE_SUCCESS: {
    code: 7601,
  },
  SERVICES_CREATE_ERROR: {
    code: 7602,
  },
  SERVICES_CREATE_BAD_REQUEST: {
    code: 7603,
  },
  SERVICES_CREATE_UNAUTHORIZED: {
    code: 7604,
  },
  SERVICES_CREATE_FORBIDDEN: {
    code: 7605,
  },
  SERVICES_CREATED_METHOD_NOT_ALLOWED: {
    code: 7606,
  },

  SERVICES_DETAILS_SUCCESS: {
    code: 7701,
  },
  SERVICES_DETAILS_ERROR: {
    code: 7702,
  },
  SERVICES_DETAILS_BAD_REQUEST: {
    code: 7703,
  },
  SERVICES_DETAILS_UNAUTHORIZED: {
    code: 7704,
  },
  SERVICES_DETAILS_FORBIDDEN: {
    code: 7705,
  },
  SERVICES_DETAILS_METHOD_NOT_ALLOWED: {
    code: 7706,
  },
  SERVICES_DETAILS_NOT_FOUND: {
    code: 7707,
  },
  // endregion SERVICES

  // region SALES
  SALES_LIST_SUCCESS: {
    code: 5501,
  },
  SALES_LIST_ERROR: {
    code: 5502,
  },
  SALES_LIST_BAD_REQUEST: {
    code: 5503,
  },
  SALES_LIST_UNAUTHORIZED: {
    code: 5504,
  },
  SALES_LIST_FORBIDDEN: {
    code: 5505,
  },
  SALES_LIST_METHOD_NOT_ALLOWED: {
    code: 5506,
  },

  SALES_DETAILS_SUCCESS: {
    code: 5601,
  },
  SALES_DETAILS_ERROR: {
    code: 5602,
  },
  SALES_DETAILS_BAD_REQUEST: {
    code: 5603,
  },
  SALES_DETAILS_UNAUTHORIZED: {
    code: 5604,
  },
  SALES_DETAILS_FORBIDDEN: {
    code: 5605,
  },
  SALES_DETAILS_METHOD_NOT_ALLOWED: {
    code: 5606,
  },
  // endregion SALES

  // region CONSUMER
  CONSUMER_DETAILS_SUCCESS: {
    code: 7801,
  },
  CONSUMER_DETAILS_ERROR: {
    code: 7802,
  },
  CONSUMER_DETAILS_BAD_REQUEST: {
    code: 7803,
  },
  CONSUMER_DETAILS_UNAUTHORIZED: {
    code: 7804,
  },
  CONSUMER_DETAILS_FORBIDDEN: {
    code: 7805,
  },
  CONSUMER_DETAILS_METHOD_NOT_ALLOWED: {
    code: 7806,
  },
  // endregion CONSUMER

  // region VIGIL
  VIGIL_DETAILS_SUCCESS: {
    code: 7901,
  },
  VIGIL_DETAILS_ERROR: {
    code: 7902,
  },
  VIGIL_DETAILS_BAD_REQUEST: {
    code: 7903,
  },
  VIGIL_DETAILS_UNAUTHORIZED: {
    code: 7904,
  },
  VIGIL_DETAILS_FORBIDDEN: {
    code: 7905,
  },
  VIGIL_DETAILS_METHOD_NOT_ALLOWED: {
    code: 7906,
  },
  // endregion VIGIL
};
