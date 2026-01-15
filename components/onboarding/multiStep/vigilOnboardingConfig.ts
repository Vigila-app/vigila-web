import { RolesEnum } from "@/src/enums/roles.enums";
import { OccupationEnum, OccupationLabels } from "@/src/enums/common.enums";
import {
  OnboardingFlowConfig,
  QuestionType,
} from "@/src/types/multiStepOnboard.types";

/**
 * Multi-step onboarding flow configuration for VIGIL users
 */
//TODO: add figma questions
export const createVigilOnboardingConfig = (
  onComplete: (data: Record<string, any>) => Promise<void>
): OnboardingFlowConfig => ({
  role: RolesEnum.VIGIL,
  initialStepId: "welcome",
  onComplete,
  steps: [
    {
      id: "welcome",
      title: "Benvenuto su Vigila!",
      description: "Iniziamo a conoscerti",
      questions: [
        {
          id: "birthday",
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
      ],
      nextStep: "contact",
    },
    {
      id: "contact",
      title: "Informazioni di contatto",
      questions: [
        {
          id: "phone",
          type: QuestionType.PHONE,
          label: "Numero di telefono",
          placeholder: "Inserisci il tuo numero di telefono",
          validation: {
            required: true,
            minLength: 2,
            maxLength: 30,
          },
          autoFocus: true,
        },
      ],
      nextStep: "occupation",
    },
    {
      id: "occupation",
      title: "La tua occupazione",
      description: "Seleziona la tua occupazione attuale",
      questions: [
        {
          id: "occupation",
          type: QuestionType.SELECT,
          label: "Occupazione",
          placeholder: "Seleziona la tua occupazione",
          options: Object.values(OccupationEnum).map((value) => ({
            value,
            label: OccupationLabels[value],
          })),
          validation: {
            required: true,
          },
        },
      ],
      // Conditional routing based on occupation
      nextStep: (answers) => {
        const requiresDocs = [
          OccupationEnum.OSA,
          OccupationEnum.OSS,
          OccupationEnum.NURSE,
        ]
        if (requiresDocs.includes(answers.occupation as OccupationEnum)) {
          return "professional-docs-info"
        }
        return "experience"
      },
    },
    {
      id: "professional-docs-info",
      title: "Documentazione professionale",
      description:
        "Per l'occupazione selezionata è richiesta documentazione certificata", //TODO: doesnt work
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
      nextStep: "experience",
    },
    {
      id: "experience",
      title: "La tua esperienza",
      description: "Raccontaci del tuo background",
      questions: [
        {
          id: "information",
          type: QuestionType.TEXTAREA,
          label: "Esperienza e competenze",
          placeholder:
            "Raccontaci se hai mai avuto esperienza di assistenza a nonni, parenti anziani, o se è la tua prima volta in questo ambito. Puoi anche indicarci eventuali competenze particolari che possiedi.",
          validation: {
            required: true,
            maxLength: 650,
          },
        },
      ],
      nextStep: "transportation",
    },
    {
      id: "transportation",
      title: "Come ti sposti?",
      description: "Seleziona il tuo mezzo di trasporto principale",
      questions: [
        {
          id: "transportation",
          type: QuestionType.RADIO,
          label: "Mezzo di trasporto",
          options: [
            { label: "Auto", value: "auto" },
            { label: "Moto", value: "moto" },
            { label: "Bicicletta", value: "bike" },
            { label: "Trasporto pubblico", value: "public" },
          ],
          validation: {
            required: true,
          },
        },
      ],
      // Conditional routing based on transportation
      nextStep: (answers) => {
        // If they have a car or moto, they might cover a wider area
        if (
          answers.transportation === "auto" ||
          answers.transportation === "moto"
        ) {
          return "service-area-wide"
        }
        return "service-area-local"
      },
    },
    {
      id: "service-area-wide",
      title: "Area di servizio",
      description: "Avendo un mezzo proprio, puoi coprire più aree",
      questions: [
        {
          id: "wideAreaCoverage",
          type: QuestionType.RADIO,
          label: "Preferisci offrire i tuoi servizi",
          options: [
            { label: "In una zona specifica vicino a me", value: "local" },
            { label: "In più zone della mia città", value: "city" },
            { label: "In tutta la provincia", value: "province" },
          ],
          validation: {
            required: true,
          },
        },
      ],
      nextStep: "address",
    },
    {
      id: "service-area-local",
      title: "Area di servizio",
      description: "Concentrati sulla tua zona locale",
      questions: [
        {
          id: "wideAreaCoverage",
          type: QuestionType.RADIO,
          label: "Preferisci offrire i tuoi servizi",
          options: [
            { label: "Nel mio quartiere", value: "local" },
            { label: "In tutta la mia città", value: "city" },
          ],
          validation: {
            required: true,
          },
        },
      ],
      nextStep: "address",
    },
    {
      id: "address",
      title: "Dove offri i tuoi servizi?",
      description: "Inserisci almeno una zona in cui vuoi operare",
      questions: [
        {
          id: "address",
          type: QuestionType.ADDRESS, //TODO: make multi
          label: "Area operativa",
          placeholder:
            "Inserisci il CAP o la città o quartiere in cui offri i tuoi servizi",
          validation: {
            required: true,
          },
        },
      ],
      // No nextStep means this is the final step
    },
  ],
})
