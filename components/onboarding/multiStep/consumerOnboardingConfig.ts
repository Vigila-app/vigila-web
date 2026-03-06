import { RolesEnum } from "@/src/enums/roles.enums";
import { FormFieldType } from "@/src/constants/form.constants";
import {
  OnboardingFlowConfig,
  QuestionType,
} from "@/src/types/multiStepOnboard.types";
import {
  UserIcon,
  HeartIcon,
  UsersIcon,
 
  FaceSmileIcon,
} from "@heroicons/react/24/outline";
import { Brain, Car, Man, Woman } from "@/components/svg";
import { Couple } from "@/components/svg/Couple";
import Stetoscopio from "@/components/svg/Stetoscopio";
import {
  ConsumerNeedsEnum,
  ConsumerNeedsLabels,
} from "@/src/enums/onboarding.enums";
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
            { label: "Me stesso/a", value: "Me stesso/a", icon: UserIcon },
            { label: "Mamma/Papà", value: "Mamma/Papà", icon: HeartIcon },
            { label: "Nonna/Nonno", value: "Nonna/Nonno", icon: UsersIcon },
            { label: "Parente", value: "Parente", icon: UsersIcon },
            { label: "Amico", value: "Amico", icon: HeartIcon },
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
      title: "Presenta la tua persona cara",
      description: "Come si chiama e quando è nato/a?",
      questions: [
        {
          id: "lovedOneName",
          type: QuestionType.TEXT,
          label: "Nome e Cognome della persona cara",
          placeholder: "Es. Giovanni Bianchi",
          validation: {
            required: true,
            ...FormFieldType.NAME,
          },
          autoFocus: true,
        },
        {
          id: "birthday",
          type: QuestionType.DATE,
          label: "La sua data di nascita",
          placeholder: "15/06/1960",
          validation: {
            required: true,
            min: new Date(new Date().setFullYear(new Date().getFullYear() - 80))
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
      title: "Dove avverrà l'assistenza?",
      description:
        "L'indirizzo ci aiuterà a trovare i vigil intorno a te ed organizzare l'assistenza.",
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
      description: "Ci aiuterà a trovare il vigil più adatto alle necessità.",
      questions: [
        {
          id: "autonomy",
          type: QuestionType.CARD,
          label: "",
          options: [
            {
              label: "Autosufficiente",
              value: "Autosufficiente",
              description: "È completamente autonoma nella vita quotidiana.",
            },
            {
              label: "Parzialmente autosufficiente",
              value: "Parzialmente autosufficiente",
              description: "Ha bisogno di aiuto in alcune attività quotidiane.",
            },
            {
              label: "Non autosufficiente",
              value: "Non autosufficiente",
              description: "Necessita d'assistenza continua.",
            },
          ],
          validation: {
            required: true,
          },
          autoFocus: true,
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
          autoFocus: true,
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
            {
              label: "Donna",
              value: "Donna",
              description: "Preferibilmente una donna",
              icon: Woman,
            },
            {
              label: "Uomo",
              value: "Uomo",
              description: "Preferibilmente un uomo",
              icon: Man,
            },
            {
              label: "Indifferente",
              value: "Indifferente",
              description: "Non importa il genere",
              icon: Couple,
            },
          ],
          validation: {
            required: true,
          },
          autoFocus: true,
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
          options: [
            {
              label: "Molto paziente",
              value: "Molto paziente",
            },
            {
              label: "Tranquillo/a e riservato/a",
              value: "Tranquillo/a e riservato/a",
            },
            {
              label: "Molto organizzato/a",
              value: "Molto organizzato/a",
            },
            {
              label: "Flessibile con gli orari",
              value: "Flessibile con gli orari",
            },
            {
              label: "Molto puntuale",
              value: "Molto puntuale",
            },
          ],
          validation: {
            required: true,
          },
          autoFocus: true,
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
          options: [
            {
              label: "Sì, OSS qualificato",
              value: "OSS",
              description: "Operatore Socio Sanitario qualificato",
              icon: Stetoscopio,
            },
            {
              label: "Assistente familiare (no qualfica)",
              value: "no OSS",
              description: "Assistenza domiciliare senza qualifica specifica",
              icon: HeartIcon,
            },
            {
              label: "Nessuna preferenza",
              value: "Indifferente",
              description: "Va bene qualsiasi profilo con esperienza",
              icon: FaceSmileIcon,
            },
          ],
          validation: {
            required: true,
          },
          autoFocus: true,
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
          options: [
            {
              label: "Sì, automunito",
              value: "auto",
              description: "Il vigil deve avere patente e un'auto",
              icon: Car,
            },
            {
              label: "No, non necessario",
              value: "no auto",
              description: "Non serve che il vigil abbia un'auto",
              icon: UserIcon,
            },
            {
              label: "Nessuna preferenza",
              value: "Indifferente",
              description: "Non è un requisito importante",
              icon: FaceSmileIcon,
            },
          ],
          validation: {
            required: true,
          },
          autoFocus: true,
        },
      ],
      nextStep: "experience",
    },
    {
      id: "experience",
      title: "È necessaria esperienza con demenza/Alzheimer?",
      description: "Indica se il vigil deve avere esperienza specifica.",
      questions: [
        {
          id: "experience",
          type: QuestionType.CARD,
          label: "",
          options: [
            {
              label: "Sì, esperienza necessaria",
              value: "dementia",
              description:
                "Il vigil deve aver avuto esperienza con pazienti con demenza o Alzheimer",
              icon: Brain,
            },
            {
              label: "No, non necessario",
              value: "no experience",
              description: "Non è richiesta esperienza specifica",
              icon: UserIcon,
            },
            {
              label: "Nessuna preferenza",
              value: "Indifferente",
              description: "Non è un requisito importante",
              icon: FaceSmileIcon,
            },
          ],
          validation: {
            required: true,
          },
          autoFocus: true,
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
