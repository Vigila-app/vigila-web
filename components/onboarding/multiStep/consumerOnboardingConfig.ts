import { RolesEnum } from "@/src/enums/roles.enums";
import { FormFieldType } from "@/src/constants/form.constants";
import {
  OnboardingFlowConfig,
  QuestionType,
} from "@/src/types/multiStepOnboard.types";

/**
 * Multi-step onboarding flow configuration for CONSUMER users
 */
export const createConsumerOnboardingConfig = (
  onComplete: (data: Record<string, any>) => Promise<void>
): OnboardingFlowConfig => ({
  role: RolesEnum.CONSUMER,
  initialStepId: "welcome",
  onComplete,
  steps: [
    {
      id: "welcome",
      title: "Benvenuto su Vigila!",
      description: "Iniziamo a conoscere la tua persona cara",
      questions: [
        {
          id: "lovedOneName",
          type: QuestionType.TEXT,
          label: "Nome della persona cara",
          placeholder: "Es. Giovanni Bianchi",
          validation: {
            required: true,
            ...FormFieldType.NAME,
          },
          autoFocus: true,
        },
      ],
      nextStep: "age-info",
    },
    {
      id: "age-info",
      title: "Informazioni sulla persona cara",
      description: "Dicci qualcosa di più",
      questions: [
        // {
        //   id: "lovedOneAge",
        //   type: QuestionType.NUMBER,
        //   label: "Età della persona cara",
        //   placeholder: "Es. 85",
        //   validation: {
        //     required: true,
        //     min: 18,
        //     max: 120,
        //   },
        //   autoFocus: true,
        // },
        //TODO: calculate age by code
        {
          id: "lovedOneBirthday",
          type: QuestionType.DATE,
          label: "Data di nascita",
          placeholder: "15/06/1960",
          validation: {
            required: true,
          },
        },
      ],
      nextStep: "contact-info",
    },
    {
      id: "contact-info",
      title: "Come possiamo contattare la persona cara?",
      questions: [
        {
          id: "lovedOnePhone",
          type: QuestionType.PHONE,
          label: "Numero di telefono",
          placeholder: "es. 3331234567",
          validation: {
            required: true,
            ...FormFieldType.PHONE,
          },
          autoFocus: true,
        },
      ],
      nextStep: "relationship",
    },
    {
      id: "relationship",
      title: "Che rapporto hai?",
      description: "Seleziona il rapporto che hai con la persona cara",
      questions: [
        {
          id: "relationship",
          type: QuestionType.RADIO,
          label: "Rapporto con la persona cara",
          options: [
            { label: "Figlio/a", value: "Figlio/a" },
            { label: "Nipote", value: "Nipote" },
            { label: "Parente", value: "Parente" },
            { label: "Amico/a", value: "Amico/a" },
            { label: "Badante", value: "Badante" },
          ],
          validation: {
            required: true,
          },
        },
      ],
      // Conditional routing based on relationship
      nextStep: (answers) => {
        // If the relationship is "Badante", ask for professional details
        if (answers.relationship === "Badante") {
          return "professional-details"
        }
        return "address"
      },
    },
    {
      id: "professional-details",
      title: "Dettagli professionali",
      description: "Grazie per prenderti cura della persona cara",
      questions: [
        {
          id: "professionalExperience",
          type: QuestionType.NUMBER,
          label: "Anni di esperienza come badante",
          placeholder: "Es. 5",
          validation: {
            required: true,
            min: 0,
            max: 50,
          },
          autoFocus: true,
        },
      ],
      nextStep: "address",
    },
    {
      id: "address",
      title: "Dove abita la persona cara?",
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
      nextStep: "additional-info",
    },
    {
      id: "additional-info",
      title: "Informazioni aggiuntive",
      description: "Aiutaci a prenderci cura al meglio della persona cara",
      questions: [
        {
          id: "information",
          type: QuestionType.TEXTAREA,
          label: "Raccontaci di più",
          placeholder:
            "Dicci tutto quello che può esserci utile sapere sulla persona cara (es. patologie, allergie, abitudini, hobby, ecc.)",
          validation: {
            required: false,
            ...FormFieldType.NOTE,
          },
        },
      ],
      // No nextStep means this is the final step
    },
  ],
})
