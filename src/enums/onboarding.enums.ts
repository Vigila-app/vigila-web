import Caffe from "@/components/svg/Caffe"
import { GenderEnum } from "./common.enums"
import { HeartIcon, XCircleIcon } from "@heroicons/react/24/outline"
import { ComponentType, SVGProps } from "react"
import Wheelchair from "@/components/svg/Wheelchair"
import Cutlery from "@/components/svg/Cutlery"
import Spray from "@/components/svg/Spray"
import CarrelloSpesa from "@/components/svg/CarrelloSpesa"
import Vasca from "@/components/svg/Vasca"
import Bed from "@/components/svg/Bed"
import Diaper from "@/components/svg/Diaper"
import Tree from "@/components/svg/Tree"
import Stetoscopio from "@/components/svg/Stetoscopio"
import Automobile from "@/components/svg/Automobile"

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
  [VigilZoneEnum.CENTRO_STORICO]: "Centro Storico",
  [VigilZoneEnum.VOMERO]: "Vomero",
  [VigilZoneEnum.CHIAIA]: "Chiaia",
  [VigilZoneEnum.POSILIPPO]: "Posilippo",
  [VigilZoneEnum.FUORIGROTTA]: "Fuorigrotta",
  [VigilZoneEnum.BAGNOLI]: "Bagnoli",
  [VigilZoneEnum.PIANURA]: "Pianura",
  [VigilZoneEnum.SOCCAVO]: "Soccavo",
  [VigilZoneEnum.ARENELLA]: "Arenella",
}

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
}

export enum VigilOccupationEnum {
  FULLTIME_CAREGIVER = "badante",
  PROFESSIONAL = "oss_ota_osa",
  NURSE = "infermiere",
  FAMILY_CAREGIVER = "assistente-familiare",
  COMPANY = "compagnia-e-supporto",
  OTHER="altro",
}

export const VigilOccupationLabels: Record<VigilOccupationEnum, string> = {
  [VigilOccupationEnum.FULLTIME_CAREGIVER]: "Badante convivente",
  [VigilOccupationEnum.PROFESSIONAL]: "OSS/OTA/OSA",
  [VigilOccupationEnum.NURSE]: "Infermiere",
  [VigilOccupationEnum.FAMILY_CAREGIVER]: "Assistente familiare a ore",
  [VigilOccupationEnum.COMPANY]: "Operatore/trice per compagnia e supporto leggero",
  [VigilOccupationEnum.OTHER]: "Altro",
}

export enum VigilDocRequirementEnum {
  ACCEPTED = "accepted",
}


export enum VigilExperienceYearsEnum {
  LT_1 = "lt_1",
  GTE_1_LT_3 = "1-3_yrs",
  GTE_3_LT_5 = "3-5_yrs",
  GTE_5 = "gte_5",
}

export const VigilExperienceLabels = {
  [VigilExperienceYearsEnum.LT_1]: "< 1 anno",
  [VigilExperienceYearsEnum.GTE_1_LT_3]: "1-3 anni",
  [VigilExperienceYearsEnum.GTE_3_LT_5]: "3-5 anni",
  [VigilExperienceYearsEnum.GTE_5]: "5+ anni",
}

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
}

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
}

export enum VigilHygieneServiceEnum {
  BATHROOM_HELP = "bathroom_help",
  BED_HELP = "bed_help",
  DIAPER_HELP = "diaper_help",
  NONE = "none",
}

export const VigilHygieneServiceLabels: Record<VigilHygieneServiceEnum, string> = {
  [VigilHygieneServiceEnum.BATHROOM_HELP]: "Aiuto in bagno (lavarsi, vestirsi)",
  [VigilHygieneServiceEnum.BED_HELP]: "Igiene a letto",
  [VigilHygieneServiceEnum.DIAPER_HELP]: "Cambio pannolone",
  [VigilHygieneServiceEnum.NONE]: "No, non mi occupo di igiene personale",
}

export const VigilHygieneServiceIcons: Record<
  VigilHygieneServiceEnum,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  [VigilHygieneServiceEnum.BATHROOM_HELP]: Vasca,
  [VigilHygieneServiceEnum.BED_HELP]: Bed,
  [VigilHygieneServiceEnum.DIAPER_HELP]: Diaper,
  [VigilHygieneServiceEnum.NONE]: XCircleIcon,
}



export enum VigilOutdoorServiceEnum {
  WALKS = "walks",
  GROCERIES = "groceries",
  DOCTOR_APPS = "doctor_apps",
  CAR_DRIVING = "car_driving",
  NONE = "none",
}

export const VigilOutdoorServiceLabels: Record<VigilOutdoorServiceEnum, string> = {
  [VigilOutdoorServiceEnum.WALKS]: "Passeggiate",
  [VigilOutdoorServiceEnum.GROCERIES]: "Spesa al supermercato",
  [VigilOutdoorServiceEnum.DOCTOR_APPS]: "Visite mediche / esami",
  [VigilOutdoorServiceEnum.CAR_DRIVING]: "Accompagnamento in auto",
  [VigilOutdoorServiceEnum.NONE]: "No, non accompagno fuori casa",
}

export const VigilOutdoorServiceIcons: Record<
  VigilOutdoorServiceEnum,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  [VigilOutdoorServiceEnum.WALKS]: Tree,
  [VigilOutdoorServiceEnum.GROCERIES]: CarrelloSpesa,
  [VigilOutdoorServiceEnum.DOCTOR_APPS]: Stetoscopio,
  [VigilOutdoorServiceEnum.CAR_DRIVING]: Automobile,
  [VigilOutdoorServiceEnum.NONE]: XCircleIcon,
}

export enum VigilPastExperienceEnum {
  SELFSUFFICIENT = "selfsufficient",
  REDUCED_MOBILITY = "reduced_mobility",
  WHEELCHAIR = "wheelchair",
  ALZHEIMER = "alzheimer",
  PARKINSON = "parkinson",
  POST_OP = "post-op",
  NIGHT = "night",
  NONE = "none",
}

export const VigilPastExperienceLabels: Record<VigilPastExperienceEnum, string> = {
  [VigilPastExperienceEnum.SELFSUFFICIENT]: "Anziani autosufficienti",
  [VigilPastExperienceEnum.REDUCED_MOBILITY]: "Anziani con mobilità ridotta",
  [VigilPastExperienceEnum.WHEELCHAIR]: "Anziani con carrozzina",
  [VigilPastExperienceEnum.ALZHEIMER]: "Alzheimer / demenza",
  [VigilPastExperienceEnum.PARKINSON]: "Parkinson",
  [VigilPastExperienceEnum.POST_OP]: "Post-operatorio",
  [VigilPastExperienceEnum.NIGHT]: "Assistenza notturna",
  [VigilPastExperienceEnum.NONE]: "Nessuna",
}

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
}

export enum VigilTimeCommitmentEnum {
  LTE_10 = "lte_10",
  GT_10_LT_20 = "gt_10_lt_20",
  GT_20_LT_30 = "gt_20_lt_30",
  GT_30 = "gt_30",
}

export const VigilTimeCommitmentLabels: Record<VigilTimeCommitmentEnum, string> = {
  [VigilTimeCommitmentEnum.LTE_10]: "Fino a 10 ore",
  [VigilTimeCommitmentEnum.GT_10_LT_20]: "10-20 ore",
  [VigilTimeCommitmentEnum.GT_20_LT_30]: "20-30 ore",
  [VigilTimeCommitmentEnum.GT_30]: "30+ ore",
}



export enum VigilCharacterTraitEnum {
  PATIENT = "patient",
  RESERVED = "reserved",
  CHATTY = "chatty",
  ORGANIZED = "organized",
  ONTIME = "ontime",
}

export const VigilCharacterTraitLabels: Record<VigilCharacterTraitEnum, string> = {
  [VigilCharacterTraitEnum.PATIENT]: "Molto paziente",
  [VigilCharacterTraitEnum.RESERVED]: "Tranquillo/a e riservato/a",
  [VigilCharacterTraitEnum.CHATTY]: "Chiacchierone/a e socievole",
  [VigilCharacterTraitEnum.ORGANIZED]: "Molto organizzato/a",
  [VigilCharacterTraitEnum.ONTIME]: "Molto puntuale",
}
export enum OccupationEnum {
  FULLTIME_CAREGIVER = "badante",
  PROFESSIONAL = "oss_ota_osa",
  NURSE = "infermiere",
  FAMILY_CAREGIVER = "assistente-familiare",
  COMPANY = "compagnia-e-supporto",
  OTHER="altro",
}

export const OccupationLabels: Record<OccupationEnum, string> = {
  [OccupationEnum.FULLTIME_CAREGIVER]: "Badante convivente",
  [OccupationEnum.PROFESSIONAL]: "OSS/OTA/OSA",
  [OccupationEnum.NURSE]: "Infermiere",
  [OccupationEnum.FAMILY_CAREGIVER]: "Assistente familiare a ore",
  [OccupationEnum.COMPANY]: "Operatore/trice per compagnia e supporto leggero",
  [OccupationEnum.OTHER]: "Altro",
}


export enum ConsumerNeedsEnum {
  COMPANY = "Compagnia",
  ESCORT = "Accompagnamento",
  DAILY_ACTIVITIES = "Aiuto Attività Quotidiane",
  FULL_HELP = "Assistenza intensa",
  
}
export const ConsumerNeedsLabels: Record<ConsumerNeedsEnum, string> = {
  [ConsumerNeedsEnum.COMPANY]: "Compagnia / Sorveglianza",
  [ConsumerNeedsEnum.ESCORT]: "Accompagnamento (commissioni, visite)",
  [ConsumerNeedsEnum.DAILY_ACTIVITIES]: "Aiuto Attività Quotidiane (farmaci,pasti,mobilità)",
  [ConsumerNeedsEnum.FULL_HELP]: "Assistenza intensa (sollevamento, igiene, allettato)",
}
