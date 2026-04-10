import { RolesEnum } from "@/src/enums/roles.enums";
import { FormFieldType } from "@/src/constants/form.constants";
import {
  OnboardingFlowConfig,
  QuestionType,
} from "@/src/types/multiStepOnboard.types";
import { UserIcon, HeartIcon, UsersIcon } from "@heroicons/react/24/outline";
import {
  ConsumerNeedsEnum,
  ConsumerNeedsLabels,
  ConsumerAutonomyEnum,
  ConsumerAutonomyLabels,
  ConsumerAutonomyDescriptions,
  ConsumerAttitudeEnum,
  ConsumerAttitudeLabels,
  ConsumerQualificationEnum,
  ConsumerQualificationLabels,
  ConsumerQualificationDescriptions,
  ConsumerQualificationIcons,
  ConsumerTransportationPreferenceEnum,
  ConsumerTransportationPreferenceLabels,
  ConsumerTransportationPreferenceDescriptions,
  ConsumerTransportationPreferenceIcons,
  ConsumerExperiencePreferenceEnum,
  ConsumerExperiencePreferenceLabels,
  ConsumerExperiencePreferenceDescriptions,
  ConsumerExperiencePreferenceIcons,
} from "@/src/enums/onboarding.enums";

import { Couple, Man, Woman } from "@/components/svg";
/**
 * Multi-step onboarding flow configuration for CONSUMER users
 */
export const createConsumerOnboardingConfig = (
  onComplete: (data: Record<string, any>) => Promise<void>,
): OnboardingFlowConfig => ({
  role: RolesEnum.CONSUMER,
  initialStepId: "relationship",
  onComplete,
  steps: [
    {
      id: "relationship",
      title: "Benvenuto su vigila!",
      description: "Iniziamo a conoscere chi ha bisogno di assistenza!",
      questions: [
        {
          id: "relationship",
          type: QuestionType.CARD,
          label: "",
          options: [
            { label: "Me stesso/a", value: "me", icon: UserIcon },
            { label: "Mamma/Papà", value: "mom_dad", icon: HeartIcon },
            { label: "Nonna/Nonno", value: "grandparent", icon: UsersIcon },
            { label: "Parente", value: "relative", icon: UsersIcon },
            { label: "Amico", value: "friend", icon: HeartIcon },
          ],
          validation: {
            required: true,
          },
        },
      ],
      // Conditional routing based on relationship
      nextStep: "name-birthday",
    },
    {
      id: "name-birthday",
      title: "Presenta chi ha bisogno di assistenza",
      description: "Come si chiama e quando è nato/a?",
      questions: [
        {
          id: "lovedOneName",
          type: QuestionType.TEXT,
          label: "Nome e Cognome ",
          placeholder: "Es. Giovanni Bianchi",
          validation: {
            required: true,
            ...FormFieldType.NAME,
          },
          autoFocus: false,
        },
        {
          id: "birthday",
          type: QuestionType.DATE,
          label: "La sua data di nascita",
          placeholder: "15/06/1960",
          validation: {
            required: true,
            min: new Date(
              new Date().setFullYear(new Date().getFullYear() - 110),
            )
              .toISOString()
              .split("T")[0],
            max: new Date(new Date().setFullYear(new Date().getFullYear() - 18))
              .toISOString()
              .split("T")[0],
          },
        },
      ],
      nextStep: "address",
    },
    {
      id: "address",
      title: "Qual è l'indirizzo di residenza?",
      description:
        "L'indirizzo ci aiuterà a trovare i vigil ed organizzare l'assistenza.",
      questions: [
        {
          id: "address",
          type: QuestionType.ADDRESS,
          label: "Indirizzo della persona cara",
          placeholder: "Inserisci la città e il CAP",
          validation: {
            required: true,
          },
        },
      ],
      nextStep: "autonomy",
    },
    {
      id: "autonomy",
      title: "Quanto è autonomo/a nella vita quotidiana?",
      description:
        "Questo ci aiuterà a trovare il vigil più adatto alle necessità.",
      questions: [
        {
          id: "autonomy",
          type: QuestionType.CARD,
          label: "",
          options: Object.values(ConsumerAutonomyEnum).map((value) => ({
            value,
            label: ConsumerAutonomyLabels[value],
            description: ConsumerAutonomyDescriptions[value],
          })),
          validation: {
            required: true,
          },
          autoFocus: false,
        },
      ],
      nextStep: "needs",
    },

    {
      id: "needs",
      title: "Quali sono i bisogni principali?",
      description:
        "Puoi selezionare più opzioni per descrivere al meglio le necessità.",

      questions: [
        {
          id: "needs",
          type: QuestionType.MULTI_CHECKBOX,
          label: "",
          options: Object.values(ConsumerNeedsEnum).map((value) => ({
            value,
            label: ConsumerNeedsLabels[value],
          })),

          validation: {
            required: true,
          },
          autoFocus: false,
        },
      ],
      nextStep: "gender_preference",
    },
    {
      id: "gender_preference",
      title: "Hai una preferenza sul genere del vigil?",
      description:
        "Scegli se preferiresti essere assistito da un uomo o una donna.",
      questions: [
        {
          id: "gender_preference",
          type: QuestionType.CARD,
          label: "",
          options: [
            { value: "male", label: "Uomo", icon: Man },
            { value: "female", label: "Donna", icon: Woman },
            {
              value: "no_preference",
              label: "Nessuna preferenza",
              icon: Couple,
            },
          ],
          validation: {
            required: true,
          },
          autoFocus: false,
        },
      ],
      nextStep: "attitude",
    },
    {
      id: "attitude",
      title: "Che tipo di attitudine cerchi?",
      description:
        "Puoi selezionare più opzioni per descrivere al meglio le caratteristiche.",

      questions: [
        {
          id: "attitude",
          type: QuestionType.MULTI_CHECKBOX,
          label: "",
          options: Object.values(ConsumerAttitudeEnum).map((value) => ({
            value,
            label: ConsumerAttitudeLabels[value],
          })),
          validation: {
            required: true,
          },
          autoFocus: false,
        },
      ],
      nextStep: "qualifications",
    },
    {
      id: "qualifications",
      title: "È necessaria una qualifica OSS?",
      description:
        "Indica se è richiesta una qualifica professionale specifica.",
      questions: [
        {
          id: "qualifications",
          type: QuestionType.CARD,
          label: "",
          options: Object.values(ConsumerQualificationEnum).map((value) => ({
            value,
            label: ConsumerQualificationLabels[value],
            description: ConsumerQualificationDescriptions[value],
            icon: ConsumerQualificationIcons[value],
          })),
          validation: {
            required: true,
          },
          autoFocus: false,
        },
      ],
      nextStep: "transportation",
    },
    {
      id: "transportation",
      title: "È necessario che sia automunito",
      description: "Indica se il vigil deve avere un mezzo di trasporto.",
      questions: [
        {
          id: "transportation",
          type: QuestionType.CARD,
          label: "",
          options: Object.values(ConsumerTransportationPreferenceEnum).map(
            (value) => ({
              value,
              label: ConsumerTransportationPreferenceLabels[value],
              description: ConsumerTransportationPreferenceDescriptions[value],
              icon: ConsumerTransportationPreferenceIcons[value],
            }),
          ),
          validation: {
            required: true,
          },
          autoFocus: false,
        },
      ],
      nextStep: "experience",
    },
    {
      id: "experience",
      title: "È necessaria esperienza specifica?",
      description:
        "Indica se il vigil deve avere esperienza specifica con patologie o esigenze particolari.",
      questions: [
        {
          id: "experience",
          type: QuestionType.CARD,
          label: "",
          options: Object.values(ConsumerExperiencePreferenceEnum).map(
            (value) => ({
              value,
              label: ConsumerExperiencePreferenceLabels[value],
              description: ConsumerExperiencePreferenceDescriptions[value],
              icon: ConsumerExperiencePreferenceIcons[value],
            }),
          ),
          validation: {
            required: true,
          },
          autoFocus: false,
        },
      ],
      nextStep: "info",
    },
    // {
    //   id: "age-info",
    //   title: "Informazioni sulla persona cara",
    //   description: "Dicci qualcosa di più",
    //   questions: [
    //     // {
    //     //   id: "lovedOneAge",
    //     //   type: QuestionType.NUMBER,
    //     //   label: "Età della persona cara",
    //     //   placeholder: "Es. 85",
    //     //   validation: {
    //     //     required: true,
    //     //     min: 18,
    //     //     max: 120,
    //     //   },
    //     //   autoFocus: true,
    //     // },
    //     //TODO: calculate age by code
    //     {
    //       id: "lovedOneBirthday",
    //       type: QuestionType.DATE,
    //       label: "Data di nascita",
    //       placeholder: "15/06/1960",
    //       validation: {
    //         required: true,
    //       },
    //     },
    //   ],
    //   nextStep: "contact-info",
    // },
    // {
    //   id: "contact-info",
    //   title: "Come possiamo contattare la persona cara?",
    //   questions: [
    //     {
    //       id: "lovedOnePhone",
    //       type: QuestionType.PHONE,
    //       label: "Numero di telefono",
    //       placeholder: "es. 3331234567",
    //       validation: {
    //         required: true,
    //         ...FormFieldType.PHONE,
    //       },
    //       autoFocus: true,
    //     },
    //   ],
    //   nextStep: "additional-info",
    // },

    {
      id: "info",
      title: "Informazioni aggiuntive",
      description:
        "Abbiamo quasi finito: se vuoi, aggiungi qualche dettaglio in più",
      questions: [
        {
          id: "information",
          type: QuestionType.TEXTAREA,
          label: "",
          placeholder:
            "Dicci tutto quello che può esserci utile sapere sulla persona cara (es. patologie, allergie, abitudini, hobby, ecc.)",
          validation: {
            required: false,
          },
        },
      ],
    },
  ],
});
