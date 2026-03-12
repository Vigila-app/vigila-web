/**
 * Centralized error messages in Italian
 * Used across utilities, components, and form validation
 */

export const ErrorMessages = {
  FORM: {
    FIELD_REQUIRED: "Il campo è obbligatorio",
    VALUE_INCORRECT: "Il valore non è corretto",
    VALUE_TOO_SHORT: "Il valore è troppo corto",
    VALUE_TOO_LONG: "Il valore è troppo lungo",
    FORMAT_INVALID: "Il formato non è valido",
    PASSWORD_MISMATCH: "La password e la conferma password non corrispondono",
    NOT_VALID: "Il modulo non è valido",
  },

  DATE_TIME: {
    INVALID_TIME_FORMAT: "Formato ora non valido. Usa HH:MM o HH:MM:SS (es. '09:00' o '09:15:30')",
    START_TIME_OUT_OF_RANGE: "L'ora di inizio deve essere tra 00:00 e 23:59",
    END_TIME_OUT_OF_RANGE: "L'ora di fine deve essere tra 00:00 e 23:59",
    END_TIME_BEFORE_START: "L'ora di fine deve essere dopo l'ora di inizio",
    INVALID_DATE_FORMAT: "Formato data non valido",
    END_DATE_BEFORE_START: "La data di fine deve essere dopo la data di inizio",
    INVALID_VALID_FROM_DATE: "Formato data 'valido da' non valido",
    INVALID_VALID_TO_DATE: "Formato data 'valido fino a' non valido",
    VALID_TO_BEFORE_VALID_FROM: "La data 'valido fino a' deve essere dopo 'valido da'",
  },

  FILE: {
    NOT_FOUND: "Il file non esiste",
    NO_PERMISSION: "Non hai il permesso di accedere al file",
    UPLOAD_CANCELED: "Il caricamento è stato annullato",
    UNKNOWN_ERROR: "Errore sconosciuto, controlla la risposta del server",
    TYPE_NOT_SUPPORTED: "Tipo di file non supportato",
    SIZE_TOO_BIG: "La dimensione del file è troppo grande",
  },

  AUTH: {
    LOGIN_REQUIRED: "Accedi con le tue credenziali",
    AUTHENTICATION_REQUIRED: "Autenticazione richiesta. Questo è previsto in modalità demo - in produzione, saresti autenticato.",
    SOCIAL_LOGIN_FAILED: "Qualcosa è andato storto con l'accesso social",
  },

  AVAILABILITY: {
    FAILED_LOAD_UNAVAILABILITIES: "Errore nel caricamento delle indisponibilità",
    FAILED_CREATE_UNAVAILABILITY: "Errore nella creazione dell'indisponibilità",
    FAILED_LOAD_RULES: "Errore nel caricamento delle regole di disponibilità",
    FAILED_CREATE_RULE: "Errore nella creazione della regola di disponibilità",
    FAILED_DELETE_RULE: "Errore nell'eliminazione della regola di disponibilità",
    FAILED_FETCH_SLOTS: "Errore nel caricamento degli slot disponibili",
  },

  LOCATION: {
    ADDRESS_NOT_FOUND: "Indirizzo non trovato per le coordinate fornite",
  },

  GENERIC: {
    SOMETHING_WENT_WRONG: "Qualcosa è andato storto",
    ERROR_OCCURRED: "Si è verificato un errore",
    DEFAULT: "Si è verificato un errore",
  },
};
