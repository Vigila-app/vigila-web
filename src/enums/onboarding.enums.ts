import Caffe from "@/components/svg/Caffe";
import {
  HeartIcon,
  XCircleIcon,
  FaceSmileIcon,
  UserIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";
import { ComponentType, SVGProps } from "react";
import Wheelchair from "@/components/svg/Wheelchair";
import Cutlery from "@/components/svg/Cutlery";
import Spray from "@/components/svg/Spray";
import CarrelloSpesa from "@/components/svg/CarrelloSpesa";
import Vasca from "@/components/svg/Vasca";
import Bed from "@/components/svg/Bed";
import Diaper from "@/components/svg/Diaper";
import Tree from "@/components/svg/Tree";
import Stetoscopio from "@/components/svg/Stetoscopio";
import Automobile from "@/components/svg/Automobile";
import { Brain, Car } from "@/components/svg";

export enum VigilZoneEnum {
  CENTRO_STORICO = "centro_storico",
  VOMERO = "vomero",
  CHIAIA = "chiaia",
  POSILIPPO = "posilippo",
  FUORIGROTTA = "fuorigrotta",
  BAGNOLI = "bagnoli",
  PIANURA = "pianura",
  SOCCAVO = "soccavo",
  ARENELLA = "arenella",
}

export const VigilZoneLabels: Record<VigilZoneEnum, string> = {
  //TODO: sostiuire con soluzione piu scalabile
  [VigilZoneEnum.CENTRO_STORICO]: "Centro Storico",
  [VigilZoneEnum.VOMERO]: "Vomero",
  [VigilZoneEnum.CHIAIA]: "Chiaia",
  [VigilZoneEnum.POSILIPPO]: "Posilippo",
  [VigilZoneEnum.FUORIGROTTA]: "Fuorigrotta",
  [VigilZoneEnum.BAGNOLI]: "Bagnoli",
  [VigilZoneEnum.PIANURA]: "Pianura",
  [VigilZoneEnum.SOCCAVO]: "Soccavo",
  [VigilZoneEnum.ARENELLA]: "Arenella",
};

export enum VigilTransportationEnum {
  AUTO = "auto",
  MOTO = "moto",
  BIKE = "bike",
  PUBLIC = "public",
  NONE = "none",
  OTHER = "other",
}

export const VigilTransportationLabels: Record<
  VigilTransportationEnum,
  string
> = {
  [VigilTransportationEnum.AUTO]: "Auto",
  [VigilTransportationEnum.MOTO]: "Moto",
  [VigilTransportationEnum.BIKE]: "Bicicletta",
  [VigilTransportationEnum.PUBLIC]: "Trasporto pubblico",
  [VigilTransportationEnum.NONE]: "Nessuno",
  [VigilTransportationEnum.OTHER]: "Altro",
};

export enum VigilOccupationEnum {
  FULLTIME_CAREGIVER = "badante",
  PROFESSIONAL = "oss_ota_osa",
  NURSE = "infermiere",
  FAMILY_CAREGIVER = "assistente-familiare",
  COMPANY = "compagnia-e-supporto",
  OTHER = "altro",
}

export const VigilOccupationLabels: Record<VigilOccupationEnum, string> = {
  [VigilOccupationEnum.FULLTIME_CAREGIVER]: "Badante convivente",
  [VigilOccupationEnum.PROFESSIONAL]: "OSS/OTA/OSA",
  [VigilOccupationEnum.NURSE]: "Infermiere",
  [VigilOccupationEnum.FAMILY_CAREGIVER]: "Assistente familiare a ore",
  [VigilOccupationEnum.COMPANY]:
    "Operatore/trice per compagnia e supporto leggero",
  [VigilOccupationEnum.OTHER]: "Altro",
};

export enum VigilDocRequirementEnum {
  ACCEPTED = "accepted",
}

export enum VigilExperienceYearsEnum {
  LESS_THAN_1_YEAR = "lt_1",
  ONE_TO_THREE_YEARS = "1-3_yrs",
  THREE_TO_FIVE_YEARS = "3-5_yrs",
  FIVE_PLUS_YEARS = "gte_5",
}

export const VigilExperienceLabels = {
  [VigilExperienceYearsEnum.LESS_THAN_1_YEAR]: "< 1 anno",
  [VigilExperienceYearsEnum.ONE_TO_THREE_YEARS]: "1-3 anni",
  [VigilExperienceYearsEnum.THREE_TO_FIVE_YEARS]: "3-5 anni",
  [VigilExperienceYearsEnum.FIVE_PLUS_YEARS]: "5+ anni",
};

export enum VigilDailyServiceEnum {
  COMPANY = "company",
  SURVEILLANCE = "surveillance",
  MOVING = "moving",
  FOOD = "food",
  CLEANING = "cleaning",
  GROCERY = "grocery",
}

export const VigilDailyServiceLabels: Record<VigilDailyServiceEnum, string> = {
  [VigilDailyServiceEnum.COMPANY]: "Compagnia e conversazione",
  [VigilDailyServiceEnum.SURVEILLANCE]: "Sorveglianza non sanitaria",
  [VigilDailyServiceEnum.MOVING]: "Aiuto negli spostamenti in casa",
  [VigilDailyServiceEnum.FOOD]: "Preparazione piatti semplici",
  [VigilDailyServiceEnum.CLEANING]: "Riordino leggero di ambienti",
  [VigilDailyServiceEnum.GROCERY]: "Spese e piccole commissioni",
};

export const VigilDailyServiceIcons: Record<
  VigilDailyServiceEnum,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  [VigilDailyServiceEnum.COMPANY]: Caffe,
  [VigilDailyServiceEnum.SURVEILLANCE]: HeartIcon,
  [VigilDailyServiceEnum.MOVING]: Wheelchair,
  [VigilDailyServiceEnum.FOOD]: Cutlery,
  [VigilDailyServiceEnum.CLEANING]: Spray,
  [VigilDailyServiceEnum.GROCERY]: CarrelloSpesa,
};

export enum VigilHygieneServiceEnum {
  BATHROOM_HELP = "bathroom_help",
  BED_HELP = "bed_help",
  DIAPER_HELP = "diaper_help",
  NONE = "none",
}

export const VigilHygieneServiceLabels: Record<
  VigilHygieneServiceEnum,
  string
> = {
  [VigilHygieneServiceEnum.BATHROOM_HELP]: "Aiuto in bagno (lavarsi, vestirsi)",
  [VigilHygieneServiceEnum.BED_HELP]: "Igiene a letto",
  [VigilHygieneServiceEnum.DIAPER_HELP]: "Cambio pannolone",
  [VigilHygieneServiceEnum.NONE]: "No, non mi occupo di igiene personale",
};

export const VigilHygieneServiceIcons: Record<
  VigilHygieneServiceEnum,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  [VigilHygieneServiceEnum.BATHROOM_HELP]: Vasca,
  [VigilHygieneServiceEnum.BED_HELP]: Bed,
  [VigilHygieneServiceEnum.DIAPER_HELP]: Diaper,
  [VigilHygieneServiceEnum.NONE]: XCircleIcon,
};

export enum VigilOutdoorServiceEnum {
  WALKS = "walks",
  GROCERIES = "groceries",
  DOCTOR_APPS = "doctor_apps",
  CAR_DRIVING = "car_driving",
  NONE = "none",
}

export const VigilOutdoorServiceLabels: Record<
  VigilOutdoorServiceEnum,
  string
> = {
  [VigilOutdoorServiceEnum.WALKS]: "Passeggiate",
  [VigilOutdoorServiceEnum.GROCERIES]: "Spesa al supermercato",
  [VigilOutdoorServiceEnum.DOCTOR_APPS]: "Visite mediche / esami",
  [VigilOutdoorServiceEnum.CAR_DRIVING]: "Accompagnamento in auto",
  [VigilOutdoorServiceEnum.NONE]: "No, non accompagno fuori casa",
};

export const VigilOutdoorServiceIcons: Record<
  VigilOutdoorServiceEnum,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  [VigilOutdoorServiceEnum.WALKS]: Tree,
  [VigilOutdoorServiceEnum.GROCERIES]: CarrelloSpesa,
  [VigilOutdoorServiceEnum.DOCTOR_APPS]: Stetoscopio,
  [VigilOutdoorServiceEnum.CAR_DRIVING]: Automobile,
  [VigilOutdoorServiceEnum.NONE]: XCircleIcon,
};

export enum VigilPastExperienceEnum {
  SELFSUFFICIENT = "self_sufficient",
  REDUCED_MOBILITY = "reduced_mobility",
  WHEELCHAIR = "wheelchair",
  ALZHEIMER = "alzheimer_dementia",
  PARKINSON = "parkinson",
  POST_OP = "post-op",
  NIGHT = "night",
  NONE = "none",
}

export const VigilPastExperienceLabels: Record<
  VigilPastExperienceEnum,
  string
> = {
  [VigilPastExperienceEnum.SELFSUFFICIENT]: "Anziani autosufficienti",
  [VigilPastExperienceEnum.REDUCED_MOBILITY]: "Anziani con mobilità ridotta",
  [VigilPastExperienceEnum.WHEELCHAIR]: "Anziani con carrozzina",
  [VigilPastExperienceEnum.ALZHEIMER]: "Alzheimer / demenza",
  [VigilPastExperienceEnum.PARKINSON]: "Parkinson",
  [VigilPastExperienceEnum.POST_OP]: "Post-operatorio",
  [VigilPastExperienceEnum.NIGHT]: "Assistenza notturna",
  [VigilPastExperienceEnum.NONE]: "Nessuna",
};

export enum VigilServiceTypeEnum {
  HOURLY_DAY = "hourly_day",
  HOURLY_NIGHT = "hourly_night",
  NIGHT = "night",
  NIGHT_AWAY = "night_away",
}

export const VigilServiceTypeLabels: Record<VigilServiceTypeEnum, string> = {
  [VigilServiceTypeEnum.HOURLY_DAY]: "A ore (giorno)",
  [VigilServiceTypeEnum.HOURLY_NIGHT]: "A ore (sera/notte)",
  [VigilServiceTypeEnum.NIGHT]: "Notte in presenza",
  [VigilServiceTypeEnum.NIGHT_AWAY]: "Notte in sorveglianza",
};

export enum VigilTimeCommitmentEnum {
  UP_TO_10_HOURS = "lte_10",
  TEN_TO_TWENTY_HOURS = "gt_10_lt_20",
  TWENTY_TO_THIRTY_HOURS = "gt_20_lt_30",
  THIRTY_PLUS_HOURS = "gt_30",
}

export const VigilTimeCommitmentLabels: Record<
  VigilTimeCommitmentEnum,
  string
> = {
  [VigilTimeCommitmentEnum.UP_TO_10_HOURS]: "Fino a 10 ore",
  [VigilTimeCommitmentEnum.TEN_TO_TWENTY_HOURS]: "10-20 ore",
  [VigilTimeCommitmentEnum.TWENTY_TO_THIRTY_HOURS]: "20-30 ore",
  [VigilTimeCommitmentEnum.THIRTY_PLUS_HOURS]: "30+ ore",
};

export enum VigilCharacterTraitEnum {
  PATIENT = "patient",
  RESERVED = "reserved",
  CHATTY = "chatty",
  ORGANIZED = "organized",
  ONTIME = "ontime",
  FLEXIBLE = "flexible",
}

export const VigilCharacterTraitLabels: Record<
  VigilCharacterTraitEnum,
  string
> = {
  [VigilCharacterTraitEnum.PATIENT]: "Molto paziente",
  [VigilCharacterTraitEnum.RESERVED]: "Tranquillo/a e riservato/a",
  [VigilCharacterTraitEnum.CHATTY]: "Chiacchierone/a e socievole",
  [VigilCharacterTraitEnum.ORGANIZED]: "Molto organizzato/a",
  [VigilCharacterTraitEnum.ONTIME]: "Molto puntuale",
  [VigilCharacterTraitEnum.FLEXIBLE]: "Flessibile con gli orari",
};
export enum OccupationEnum {
  FULLTIME_CAREGIVER = "badante",
  PROFESSIONAL = "oss_ota_osa",
  NURSE = "infermiere",
  FAMILY_CAREGIVER = "assistente-familiare",
  COMPANY = "compagnia-e-supporto",
  OTHER = "altro",
}

export const OccupationLabels: Record<OccupationEnum, string> = {
  [OccupationEnum.FULLTIME_CAREGIVER]: "Badante convivente",
  [OccupationEnum.PROFESSIONAL]: "OSS/OTA/OSA",
  [OccupationEnum.NURSE]: "Infermiere",
  [OccupationEnum.FAMILY_CAREGIVER]: "Assistente familiare a ore",
  [OccupationEnum.COMPANY]: "Operatore/trice per compagnia e supporto leggero",
  [OccupationEnum.OTHER]: "Altro",
};

export enum ConsumerAutonomyEnum {
  SELF_SUFFICIENT = "self_sufficient",
  PARTIALLY = "reduced_mobility",
  NOT_SUFFICIENT = "not_sufficient",
}

export const ConsumerAutonomyLabels: Record<ConsumerAutonomyEnum, string> = {
  [ConsumerAutonomyEnum.SELF_SUFFICIENT]: "Autosufficiente",
  [ConsumerAutonomyEnum.PARTIALLY]:
    "Parzialmente autosufficiente/mobilità ridotta",
  [ConsumerAutonomyEnum.NOT_SUFFICIENT]: "Non autosufficiente",
};

export const ConsumerAutonomyDescriptions: Record<
  ConsumerAutonomyEnum,
  string
> = {
  [ConsumerAutonomyEnum.SELF_SUFFICIENT]:
    "È completamente autosufficiente nella vita quotidiana.",
  [ConsumerAutonomyEnum.PARTIALLY]:
    "Ha bisogno di aiuto in alcune attività quotidiane.",
  [ConsumerAutonomyEnum.NOT_SUFFICIENT]: "Necessita d'assistenza continua.",
};

export enum ConsumerAttitudeEnum {
  PATIENT = "patient",
  RESERVED = "reserved",
  ORGANIZED = "organized",
  FLEXIBLE = "flexible",
  ONTIME = "ontime",
}

export const ConsumerAttitudeLabels: Record<ConsumerAttitudeEnum, string> = {
  [ConsumerAttitudeEnum.PATIENT]: "Molto paziente",
  [ConsumerAttitudeEnum.RESERVED]: "Tranquillo/a e riservato/a",
  [ConsumerAttitudeEnum.ORGANIZED]: "Molto organizzato/a",
  [ConsumerAttitudeEnum.FLEXIBLE]: "Flessibile con gli orari",
  [ConsumerAttitudeEnum.ONTIME]: "Molto puntuale",
};

export enum ConsumerQualificationEnum {
  OSS = "oss",
  NO_OSS = "no_oss",
  NO_PREFERENCE = "no_preference",
}

export const ConsumerQualificationLabels: Record<
  ConsumerQualificationEnum,
  string
> = {
  [ConsumerQualificationEnum.OSS]: "Sì, OSS qualificato",
  [ConsumerQualificationEnum.NO_OSS]: "Assistente familiare (no qualifica)",
  [ConsumerQualificationEnum.NO_PREFERENCE]: "Nessuna preferenza",
};

export const ConsumerQualificationDescriptions: Record<
  ConsumerQualificationEnum,
  string
> = {
  [ConsumerQualificationEnum.OSS]: "Operatore Socio Sanitario qualificato",
  [ConsumerQualificationEnum.NO_OSS]:
    "Assistenza domiciliare senza qualifica specifica",
  [ConsumerQualificationEnum.NO_PREFERENCE]:
    "Va bene qualsiasi profilo con esperienza",
};

export const ConsumerQualificationIcons: Record<
  ConsumerQualificationEnum,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  [ConsumerQualificationEnum.OSS]: Stetoscopio,
  [ConsumerQualificationEnum.NO_OSS]: HeartIcon,
  [ConsumerQualificationEnum.NO_PREFERENCE]: FaceSmileIcon,
};

export enum ConsumerTransportationPreferenceEnum {
  CAR_REQUIRED = "auto",
  NOT_REQUIRED = "no_auto",
  NO_PREFERENCE = "no_preference",
}

export const ConsumerTransportationPreferenceLabels: Record<
  ConsumerTransportationPreferenceEnum,
  string
> = {
  [ConsumerTransportationPreferenceEnum.CAR_REQUIRED]: "Sì, automunito",
  [ConsumerTransportationPreferenceEnum.NOT_REQUIRED]: "No, non necessario",
  [ConsumerTransportationPreferenceEnum.NO_PREFERENCE]: "Nessuna preferenza",
};

export const ConsumerTransportationPreferenceDescriptions: Record<
  ConsumerTransportationPreferenceEnum,
  string
> = {
  [ConsumerTransportationPreferenceEnum.CAR_REQUIRED]:
    "Il vigil deve avere patente e un'auto",
  [ConsumerTransportationPreferenceEnum.NOT_REQUIRED]:
    "Non serve che il vigil abbia un'auto propria",
  [ConsumerTransportationPreferenceEnum.NO_PREFERENCE]:
    "Non è un requisito importante",
};

export const ConsumerTransportationPreferenceIcons: Record<
  ConsumerTransportationPreferenceEnum,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  [ConsumerTransportationPreferenceEnum.CAR_REQUIRED]: Car,
  [ConsumerTransportationPreferenceEnum.NOT_REQUIRED]: UserIcon,
  [ConsumerTransportationPreferenceEnum.NO_PREFERENCE]: FaceSmileIcon,
};

export enum ConsumerExperiencePreferenceEnum {
  DEMENTIA_REQUIRED = "alzheimer_dementia",
  PARKINSON = "parkinson",
  POST_OP = "post-op",
  WHEELCHAIR = "wheelchair",
  NOT_REQUIRED = "not_required",
}

export const ConsumerExperiencePreferenceLabels: Record<
  ConsumerExperiencePreferenceEnum,
  string
> = {
  [ConsumerExperiencePreferenceEnum.DEMENTIA_REQUIRED]: "Demenza o Alzheimer",
  [ConsumerExperiencePreferenceEnum.PARKINSON]: "Parkinson",
  [ConsumerExperiencePreferenceEnum.POST_OP]: "Post-operatoria",
  [ConsumerExperiencePreferenceEnum.WHEELCHAIR]: "Uso della carrozzina",
  [ConsumerExperiencePreferenceEnum.NOT_REQUIRED]: "No, non necessario",
};

export const ConsumerExperiencePreferenceDescriptions: Record<
  ConsumerExperiencePreferenceEnum,
  string
> = {
  [ConsumerExperiencePreferenceEnum.DEMENTIA_REQUIRED]:
    "Richiesta esperienza con pazienti con demenza o Alzheimer",
  [ConsumerExperiencePreferenceEnum.PARKINSON]:
    "Richiesta esperienza con pazienti con Parkinson",
  [ConsumerExperiencePreferenceEnum.POST_OP]:
    "Gestione del recupero post-operatorio",
  [ConsumerExperiencePreferenceEnum.WHEELCHAIR]:
    "Supporto nella mobilità e spostamenti",
  [ConsumerExperiencePreferenceEnum.NOT_REQUIRED]:
    "Non è richiesta esperienza specifica",
};

export const ConsumerExperiencePreferenceIcons: Record<
  ConsumerExperiencePreferenceEnum,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  [ConsumerExperiencePreferenceEnum.DEMENTIA_REQUIRED]: Brain,
  [ConsumerExperiencePreferenceEnum.PARKINSON]: Brain,
  [ConsumerExperiencePreferenceEnum.POST_OP]: BeakerIcon,
  [ConsumerExperiencePreferenceEnum.WHEELCHAIR]: Wheelchair,
  [ConsumerExperiencePreferenceEnum.NOT_REQUIRED]: UserIcon,
};

export enum ConsumerNeedsEnum {
  COMPANY = "Compagnia",
  ESCORT = "Accompagnamento",
  DAILY_ACTIVITIES = "Aiuto Attività Quotidiane",
  FULL_HELP = "Assistenza intensa",
}
export const ConsumerNeedsLabels: Record<ConsumerNeedsEnum, string> = {
  [ConsumerNeedsEnum.COMPANY]: "Compagnia / Sorveglianza",
  [ConsumerNeedsEnum.ESCORT]: "Accompagnamento (commissioni, visite)",
  [ConsumerNeedsEnum.DAILY_ACTIVITIES]:
    "Aiuto Attività Quotidiane (farmaci, pasti, mobilità)",
  [ConsumerNeedsEnum.FULL_HELP]:
    "Assistenza intensa (sollevamento, igiene, allettato)",
};
