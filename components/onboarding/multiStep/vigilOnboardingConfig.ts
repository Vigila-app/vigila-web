import { RolesEnum } from "@/src/enums/roles.enums"
import {
  OnboardingFlowConfig,
  QuestionType,
} from "@/src/types/multiStepOnboard.types"
import {
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline"

import {
  OccupationEnum,
  OccupationLabels,
  VigilCharacterTraitEnum,
  VigilCharacterTraitLabels,
  VigilDailyServiceEnum,
  VigilDailyServiceIcons,
  VigilDailyServiceLabels,
  VigilExperienceLabels,
  VigilExperienceYearsEnum,
  VigilHygieneServiceEnum,
  VigilHygieneServiceIcons,
  VigilHygieneServiceLabels,
  VigilOutdoorServiceEnum,
  VigilOutdoorServiceIcons,
  VigilOutdoorServiceLabels,
  VigilPastExperienceEnum,
  VigilPastExperienceLabels,
  VigilServiceTypeEnum,
  VigilServiceTypeLabels,
  VigilTimeCommitmentEnum,
  VigilTimeCommitmentLabels,
  VigilTransportationEnum,
  VigilTransportationLabels,
  VigilZoneEnum,
  VigilZoneLabels,
} from "@/src/enums/onboarding.enums"
import { GenderEnum, GenderLabels } from "@/src/enums/common.enums"

/**
 * Multi-step onboarding flow configuration for VIGIL users
 */
export const createVigilOnboardingConfig = (
  onComplete: (data: Record<string, any>) => Promise<void>,
): OnboardingFlowConfig => ({
  role: RolesEnum.VIGIL,
  initialStepId: "welcome",
  onComplete,
  //Nota: ho modificare leggermente il primo step rispetto a figma: alcune info le abbiamo dal form di registrazione
  steps: [
    {
      id: "welcome",
      title: "Benvenuto su Vigila!",
      description:
        "Questi dati consentono di gestire al meglio preferenze ed abbinamenti.",
      questions: [
        {
          id: "birthday", //anagrafica
          type: QuestionType.DATE,
          label: "Data di nascita", //TODO: better error message + eu format
          validation: {
            required: true,
            min: new Date(new Date().setFullYear(new Date().getFullYear() - 80))
              .toISOString()
              .split("T")[0],
            max: new Date(new Date().setFullYear(new Date().getFullYear() - 18))
              .toISOString()
              .split("T")[0],
          },
          autoFocus: true,
        },
        {
          id: "gender", //anagrafica
          type: QuestionType.SELECT,
          label: "Genere",
          options: Object.values(GenderEnum).map((value) => ({
            value,
            label: GenderLabels[value],
          })),
        },
      ],
      nextStep: "address",
    },
    {
      id: "address",
      title: "Qual è il tuo indirizzo di residenza?",
      description:
        "Questo indirizzo non sarà visibile alle famiglie. Servirà per verifiche interne.",
      questions: [
        {
          id: "addresses", //anagrafica
          type: QuestionType.MULTI_ADDRESS,
          label: "",
          placeholder: "Inserisci il CAP o città...",
          validation: {
            required: true,
          },
        },
      ],
      nextStep: "zones",
      
    },
    {
      id: "zones", //non salvare per ora
      title: "In quali zone sei disponibile a lavorare?",
      description:
        "Seelzione tutte le zone di Napoli in cui puoi offrire i tuoi servizi",
      questions: [
        {
          id: "zones",
          label: "",
          type: QuestionType.MULTI_CHECKBOX,
          options: Object.values(VigilZoneEnum).map((value) => ({
            value,
            label: VigilZoneLabels[value],
          })),
          validation: {
            required: true,
          },
        },
      ],
      nextStep: "transportation",
    },
    {
      id: "transportation",
      title: "Hai un mezzo di trasporto?",
      description:
        "Questo aiuta le famiglie a capire se puoi accompagnare fuori casa.",
      questions: [
        {
          id: "transportation_mode",
          type: QuestionType.RADIO,
          label: "",
          options: Object.values(VigilTransportationEnum).map((value) => ({
            value,
            label: VigilTransportationLabels[value],
          })),
          validation: {
            required: true,
          },
        },
      ],
      nextStep: "occupation",
    },
    {
      id: "occupation",
      title: "Come descriveresti il tuo ruolo principale?",
      description: "Seleziona quello che ti rappresenta meglio",
      questions: [
        {
          id: "occupation",
          label: "",
          type: QuestionType.RADIO,
          options: Object.values(OccupationEnum).map((value) => ({
            value,
            label: OccupationLabels[value],
          })),

          validation: {
            required: true,
          },
        },
      ],
      nextStep: (answers) => {
        const requiresDocs = [OccupationEnum.PROFESSIONAL, OccupationEnum.NURSE]
        if (requiresDocs.includes(answers.occupation as OccupationEnum)) {
          return "professional_docs_info"
        }
        return "courses"
      },
    },
    {
      id: "professional_docs_info",
      title: "Documentazione professionale",
      description:
        "Per l'occupazione selezionata è richiesta documentazione certificata",
      questions: [
        {
          id: "understandsDocRequirement",
          type: QuestionType.CHECKBOX,
          label:
            "Comprendo che dovrò inviare la documentazione che attesta la mia qualifica professionale",
          validation: {
            required: true,
            validate: (value) =>
              value === true || "Devi accettare per continuare",
          },
        },
      ],
      nextStep: "courses",
    },
    {
      id: "courses",
      title: "Hai titoli o corsi di formazione?",
      description:
        "Es. OSS, corso assistente familiare, altri corsi... Lascia vuoto se non ne hai.",
      questions: [
        {
          id: "courses",
          type: QuestionType.TEXTAREA,
          label: "",
          placeholder:
            "Esempio: corso OSS conseguito nel 2020, corso di primo soccorso...",

          validation: {
            required: false,
            maxLength: 650,
          },
        },
      ],
      nextStep: "years_of_experience",
    },
    {
      id: "years_of_experience",
      title: "Da quanto anni lavori nell'assistenza?",
      description: "Seleziona al fascia che ti rappresenta",
      questions: [
        {
          id: "experience_years",
          type: QuestionType.RADIO,
          label: "",
          options: Object.values(VigilExperienceYearsEnum).map((value) => ({
            value,
            label: VigilExperienceLabels[value],
          })),
          validation: {
            required: true,
          },
        },
      ],
      nextStep: "about",
    },
    {
      id: "about",
      title: "Raccontaci brevemente la tua esperienza",
      description:
        "3-4 righe che appariranno sul tuo profilo. Massimo 400 caratteri. ",
      questions: [
        {
          id: "bio", //anagrafica
          type: QuestionType.TEXTAREA,
          label: "",
          placeholder:
            "Ho lavorato per 5 anni come assistente familiare, prendendomi cura di anziani con diverse necessità...",
          validation: {
            required: true,
            maxLength: 400,
          },
        },
      ],
      nextStep: "daily_activities",
    },
    {
      id: "daily_activities",
      title: "In cosa puoi aiutare nella vita quotidiana?",
      description: "Seleziona tutti i servizi che offri",
      questions: [
        {
          id: "services",
          type: QuestionType.MULTI_CHECKBOX,
          label: "",
          validation: {
            required: true,
          },
          options: Object.values(VigilDailyServiceEnum).map((value) => ({
            value,
            label: VigilDailyServiceLabels[value],
            icon: VigilDailyServiceIcons[value],
          })),
        },
      ],
      nextStep: "hygene",
    },
    {
      id: "hygene",
      title: "Ti occupi di igene personale?",
      description: "Seleziona tutto ciò in cui puoi aiutare",
      questions: [
        {
          id: "hygene_services",
          label: "",
          type: QuestionType.MULTI_CHECKBOX,
          options: Object.values(VigilHygieneServiceEnum).map((value) => ({
            value,
            label: VigilHygieneServiceLabels[value],
            icon: VigilHygieneServiceIcons[value],
          })),
          validation: {
            required: true,
          },
        },
      ],
      nextStep: (answers) => {
        if (answers.services?.includes(VigilHygieneServiceEnum.NONE)) {
          answers.services = answers.services.filter(
            (s: string) => s == VigilHygieneServiceEnum.NONE,
          ) //if "none" is selected, ignore everything else
        }
        return "outside"
      },
    },
    {
      id: "outside",
      title: "Puoi accompagnare fuori casa?",
      description: "Seleziona le attività di accompagnamento che offri",
      questions: [
        {
          id: "outdoor_services",
          label: "",
          type: QuestionType.MULTI_CHECKBOX,
          options: Object.values(VigilOutdoorServiceEnum).map((value) => ({
            value,
            label: VigilOutdoorServiceLabels[value],
            icon: VigilOutdoorServiceIcons[value],
          })),
          validation: {
            required: true,
          },
        },
      ],
      nextStep: (answers) => {
        if (answers.outside?.includes(VigilOutdoorServiceEnum.NONE)) {
          answers.outside = answers.outside.filter(
            (s: string) => s == VigilOutdoorServiceEnum.NONE,
          ) //if "none" is selected, ignore everything else
        }
        return "past_exp"
      },
    },
    {
      id: "past_exp",
      title: "Con quali situazioni hai già esperienza?",
      description: "Seleziona tutte le situazioni con cui hai familiarità",
      questions: [
        {
          id: "past_experience",
          label: "",
          type: QuestionType.MULTI_CHECKBOX,
          options: Object.values(VigilPastExperienceEnum).map((value) => ({
            value,
            label: VigilPastExperienceLabels[value],
          })),
          validation: {
            required: true,
          },
        },
      ],
      nextStep: "service_type",
    },
    {
      id: "service_type", //dont save for now - keep for future matching algo
      title: "Che tipo di servizio offri?",
      description: "Puoi selezionare più opzioni",
      questions: [
        {
          type: QuestionType.MULTI_CHECKBOX,
          label: "",
          id: "type",
          options: Object.values(VigilServiceTypeEnum).map((value) => ({
            value,
            label: VigilServiceTypeLabels[value],
          })),
          validation: {
            required: true,
          },
        },
      ],
      nextStep: "hours",
    },
    {
      id: "hours",
      title: "Quante ore a settimana vorresti lavorare?",
      description: "Questo ci aiuta a proporti offerte adatte?",
      questions: [
        {
          id: "time_committment",
          type: QuestionType.RADIO,
          label: "",
          options: Object.values(VigilTimeCommitmentEnum).map((value) => ({
            value,
            label: VigilTimeCommitmentLabels[value],
          })),
          validation: {
            required: true,
          },
        },
      ],
      nextStep: "availabilities",
    },
    {
      id: "availabilities",
      title: "Qual è la tua disponibilità settimanale?",
      description: "Seleziona i giorni in cui sei disponibile e gli orari",
      questions: [
        {
          id: "availabilities",
          type: QuestionType.AVAILABILITIES,
          label: "Disponibilità",
          validation: {
            required: false,
          },
        },
      ],
      nextStep: "urgent",
    },
    {
      title: "Sei disponibile per richieste urgenti?",
      description: "Ultimo minuto o situazioni di emergenza",
      id: "urgent",
      questions: [
        {
          id: "urgent_requests",
          type: QuestionType.CARD,
          label: "",
          options: [
            {
              label: "Si, sono disponibile",
              description: "Riceverai notifiche per richieste urgenti",
              icon: CheckCircleIcon,
              value: "yes",
            },
            {
              label: "No, preferisco programmare",
              description: "Riceverai solo richieste pianificate",
              icon: XCircleIcon,
              value: "no",
            },
          ],
        },
      ],
      nextStep: "character",
    },
    {
      title: "Come descriveresti il tuo carattere?",
      description: "Seleziona massimo 3 caratteristiche che ti rappresentano",
      id: "character",
      questions: [
        {
          id: "character",
          type: QuestionType.MULTI_CHECKBOX,
          label: "",
          max: 3,
          options: Object.values(VigilCharacterTraitEnum).map((value) => ({
            value,
            label: VigilCharacterTraitLabels[value],
          })),
          validation: {
            required: true,
          },
        },
      ],
      nextStep: "languages",
    },
    {
      title: "Parli italiano fluentemente?",
      description: "",
      id: "languages",
      questions: [
        {
          id: "language_confirmation",
          // type: QuestionType.SELECT_MULTI,
          type: QuestionType.CHECKBOX,
          label: "Confermo di saper parlare italiano fluentemente.",
          // options: [
          //   { label: "Italiano", value: "italian", icon: HomeIcon }, //TODO: add flags
          //   { label: "Inglese", value: "english" },
          //   { label: "Rumeno", value: "romanian" },
          //   { label: "Arabo", value: "arabic" },
          //   { label: "Albanese", value: "albanian" },
          //   { label: "Spagnolo", value: "spanish" },
          //   { label: "Francese", value: "french" },
          //   { label: "Cinese", value: "chinese" },
          //   { label: "Ucraino", value: "ukrainian" },
          //   { label: "Filippino (Tagalog)", value: "tagalog" },
          //   { label: "Hindi", value: "hindi" },
          //   { label: "Tedesco", value: "german" },
          //   { label: "Portoghese", value: "portuguese" },
          //   { label: "Bengalese", value: "bengali" },
          //   { label: "Russo", value: "russian" },
          //   { label: "Polacco", value: "polish" },
          //   { label: "Serbo", value: "serbian" },
          //   { label: "Urdu", value: "urdu" },
          //   { label: "Punjabi", value: "punjabi" },
          //   { label: "Persiano (Farsi)", value: "persian" },
          //   { label: "Altri", value: "other" },
          // ],
          validation: {
            required: true,
            validate: (value) =>
              value === true || "Devi confermare per continuare",
          },
        },
      ],
      nextStep: "propic", //todo: redirect to a sorry page if not checked
    },
    {
      id: "propic",
      title: "Aggiungi una foto profilo",
      description: "Una foto sorridente aiuta le famiglie a conoscerti meglio.",
      questions: [
        {
          id: "propic",
          type: QuestionType.FILE,
          label: "",
          validation: {
            required: true,
          },
        },
      ],
    },
  ],
})
