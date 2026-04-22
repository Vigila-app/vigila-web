import { RolesEnum } from "@/src/enums/roles.enums";

export type EventParams = Record<string, string | number | boolean | undefined>;

/**
 * Manda un evento al dataLayer di GTM.
 */
export const track = (eventName: string, params?: EventParams) => {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...params,
    });
  }
};

/**
 * Utente apre il form di registrazione
 * QUANDO: useEffect del componente form signup
 */
export const trackSignupStarted = (role: RolesEnum) => {
  track("rec_signup_started", { role });
};

/**
 * Utente completa la registrazione
 * QUANDO: dopo risposta positiva API signup
 */
export const trackSignupCompleted = (userId: string, role: RolesEnum) => {
  track("rec_signup_completed", {
    user_id: userId,
    role,
  });
};

/**
 * Utente inizia il processo di booking
 * QUANDO: click su "Prenota" o ingresso nel flusso booking
 */
export const trackOdBookingStarted = (userId: string, serviceType: string) => {
  track("od_booking_started", {
    segment: "ondemand",
    user_id: userId,
    service_type: serviceType, // 'accompagnamento' | 'compagnia' | 'igiene'
  });
};

/**
 * Utente arriva alla schermata di pagamento
 * QUANDO: useEffect della pagina checkout
 */
export const trackOdPaymentStarted = (userId: string, value: number) => {
  track("od_payment_started", {
    segment: "ondemand",
    user_id: userId,
    value: value,
    currency: "EUR",
  });
};

/**
 * Pagamento completato
 * QUANDO: dopo conferma positiva dal payment provider
 */
export const trackOdBookingCompleted = (
  userId: string,
  value: number,
  serviceType: string,
) => {
  track("od_booking_completed", {
    segment: "ondemand",
    user_id: userId,
    value: value,
    currency: "EUR",
    service_type: serviceType,
  });
};

/**
 * Utente inizia il questionario di onboarding
 * QUANDO: quando viene mostrata la prima domanda
 */
export const trackQuestionnaireStarted = (userId: string, role: RolesEnum) => {
  track("rec_questionnaire_started", {
    user_id: userId,
    role,
  });
};

/**
 * Utente completa il questionario di onboarding
 * QUANDO: dopo invio ultima risposta
 */
export const trackQuestionnaireCompleted = (
  userId: string,
  role: RolesEnum,
) => {
  track("rec_questionnaire_completed", {
    user_id: userId,
    role,
  });
};

/**
 * Il sistema propone un match
 * QUANDO: quando mostriamo alla famiglia un caregiver
 */
export const trackRecMatchProposed = (
  userId: string,
  caregiverId: string,
  matchScore: number,
) => {
  track("rec_match_proposed", {
    segment: "recurring",
    user_id: userId,
    caregiver_id: caregiverId,
    match_score: matchScore, // es. 85 per 85%
  });
};

/**
 * La famiglia accetta il match proposto
 * QUANDO: click su "Accetta"
 */
export const trackRecMatchAccepted = (userId: string, caregiverId: string) => {
  track("rec_match_accepted", {
    segment: "recurring",
    user_id: userId,
    caregiver_id: caregiverId,
  });
};

/**
 * Utente arriva al checkout del trial
 * QUANDO: useEffect della pagina checkout trial
 */
export const trackRecPaymentStarted = (userId: string, value: number) => {
  track("rec_payment_started", {
    segment: "recurring",
    user_id: userId,
    value: value,
    currency: "EUR",
  });
};

/**
 * Pagamento trial completato
 * QUANDO: dopo conferma positiva dal payment provider
 */
export const trackRecTrialStarted = (
  userId: string,
  value: number,
  caregiverId: string,
) => {
  track("rec_trial_started", {
    segment: "recurring",
    user_id: userId,
    value: value,
    currency: "EUR",
    caregiver_id: caregiverId,
  });
};
