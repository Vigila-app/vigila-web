import { RolesEnum } from "@/src/enums/roles.enums";
import { OccupationEnum, OccupationLabels } from "@/src/enums/common.enums";
import {
  OnboardingFlowConfig,
  QuestionType,
} from "@/src/types/multiStepOnboard.types";
import {
  BoltIcon,
  BookOpenIcon,
  CakeIcon,
  MusicalNoteIcon,
  PaintBrushIcon,
  SunIcon,
} from "@heroicons/react/24/outline";

/**
 * Multi-step onboarding flow configuration for VIGIL users
 */
//TODO: add figma questions
export const createVigilOnboardingConfig = (
  onComplete: (data: Record<string, any>) => Promise<void>
): OnboardingFlowConfig => ({
  role: RolesEnum.VIGIL,
  initialStepId: "service-areas",
  onComplete,
  //Nota: ho modificare leggermente il primo step rispetto a figma: alcune info le abbiamo dal form di registrazione
  steps: [
    {
      id: "welcome",
      title: "Benvenuto su Vigila!",
      description:
        "Abbiamo bisogno di qualche info in più per creare un'esperienza su misura. Questo step richiede meno di cinque minuti.",
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
        {
          id: "occupation",
          type: QuestionType.SELECT,
          label: "Professione",
          placeholder: "Seleziona la tua professione",
          options: Object.values(OccupationEnum).map((value) => ({
            value,
            label: OccupationLabels[value],
          })),
          validation: {
            required: true,
          },
        },
        {
          id: "information",
          type: QuestionType.TEXTAREA,
          label: "Perchè vuoi aiutare gli anziani?",
          placeholder: "Condividi la tua motivazione...",
          validation: {
            required: true,
            maxLength: 650,
          },
        },
      ],
      nextStep: (answers) => {
        const requiresDocs = [
          OccupationEnum.OSA,
          OccupationEnum.OSS,
          OccupationEnum.NURSE,
        ];
        if (requiresDocs.includes(answers.occupation as OccupationEnum)) {
          return "professional-docs-info";
        }
        return "hobbies";
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
      nextStep: "hobbies",
    },
    {
      id: "hobbies",
      title: "Quali sono i tuoi interessi?",
      description:
        "Condividi le tue passioni per creare delle connessioni autentiche",
      questions: [
        {
          id: "hobbies",
          type: QuestionType.MULTI_CHECKBOX,
          label: "Hobby e passioni:",
          //TODO: icons from figma
          options: [
            { label: "Lettura", value: "reading", icon: BookOpenIcon },
            { label: "Musica", value: "music", icon: MusicalNoteIcon },
            { label: "Arte e creatività", value: "art", icon: PaintBrushIcon },
            { label: "Natura e passeggiate", value: "nature", icon: SunIcon },
            { label: "Cucina", value: "cooking", icon: CakeIcon },
            { label: "Sport e movimento", value: "sport", icon: BoltIcon },
          ],
          validation: {
            required: true,
          },
        },
      ],
      nextStep: "transportation",
    },
    {
      id: "service-areas",
      title: "In quali zone sei disponibile ad operare?",
      description:
        "Seleziona tutte le zone di Napoli dove sei disposto ad offire i tuoi servizi.",
      questions: [
        {
          id: "addresses",
          type: QuestionType.MULTI_ADDRESS,
          label: "Aree operative",
          placeholder: "Cerca città o CAP...",
          validation: {
            required: true,
            validate: (value) => value && value.length > 0,
          },
        },
      ],
      nextStep: "transportation",
    },
    {
      id: "transportation",
      title: "Quanto tempo puoi dedicare?",
      description: "Aiutaci a capire la tua disponibilità",
      questions: [
        {
          id: "time-committment",
          type: QuestionType.RADIO,
          label: "Quanto tempo puoi dedicare?",
          options: [
            { label: "1-2 ore a settimana", value: "1-2_hours" },
            { label: "3-5 ore a settimana", value: "3-5_hours" },
            { label: "5-10 ore a settimana", value: "5-10_hours" },
            { label: "Più di 10 ore", value: "10+_hours" },
          ],
          validation: {
            required: true,
          },
        },
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
      nextStep: "activities",
    },
    {
      id: "activities",
      title: "Parlaci di te",
      description: "Aiutaci a capire come puoi aiutare gli anziani",
      questions: [
        {
          id: "experience",
          type: QuestionType.TEXTAREA, //TODO: make multi
          label: "La tua esperienza",
          placeholder:
            "Raccontaci se hai mai avuto nonni,parenti anziani, o se è la tua prima volta....",
          validation: {
            required: true,
          },
        },
        {
          id: "activities", //TODO: possibilmente ridondante rispetto allo step prima
          type: QuestionType.MULTI_CHECKBOX,
          label: "Quali attività vuoi fare con gli anziani?",
          options: [
            { label: "Ascoltare", value: "listening" },
            { label: "Cucinare", value: "cooking" },
            { label: "Tecnologia", value: "tech" },
            { label: "Leggere", value: "reading" },
            { label: "Giocare", value: "games" },
            { label: "Guidare", value: "drive" },
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
      title: "Qual è il tuo indirizzo di residenza?",
      description:
        "Questo indirizzo non sarà visibile alle famiglie. Servirà per verifiche interne.",
      questions: [
        {
          id: "address",
          type: QuestionType.ADDRESS,
          label: "",
          placeholder: "Inserisci il CAP o città...",
          validation: {
            required: true,
          },
        },
      ],
      nextStep: (answers) => {
        // If they have a car or moto, they might cover a wider area
        if (
          answers.transportation === "auto" ||
          answers.transportation === "moto"
        ) {
          return "service-area-wide";
        }
        return "service-area-local";
      },
      // No nextStep means this is the final step
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
    },
  ],
});
