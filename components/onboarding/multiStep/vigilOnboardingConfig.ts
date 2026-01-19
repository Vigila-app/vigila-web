import { RolesEnum } from "@/src/enums/roles.enums"
import { OccupationEnum, OccupationLabels } from "@/src/enums/common.enums"
import {
  OnboardingFlowConfig,
  QuestionType,
} from "@/src/types/multiStepOnboard.types"
import {
  BoltIcon,
  BookOpenIcon,
  CakeIcon,
  ChatBubbleBottomCenterIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  FireIcon,
  HeartIcon,
  HomeIcon,
  MusicalNoteIcon,
  NewspaperIcon,
  PaintBrushIcon,
  ShoppingBagIcon,
  SparklesIcon,
  SunIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline"

/**
 * Multi-step onboarding flow configuration for VIGIL users
 */
//TODO: add figma questions
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
          id: "gender",
          type: QuestionType.SELECT,
          label: "Genere",
          options: [
            { value: "male", label: "Maschio" },
            { value: "female", label: "Femmina" },
            { value: "nb", label: "Non Binario" },
            { value: "other", label: "Altro" },
            { value: "na", label: "Preferisco non specificare" },
          ],
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
      nextStep: "zones",
    },
    {
      id: "zones",
      title: "In quali zone sei disponibile a lavorare?",
      description:
        "Seelzione tutte le zone di Napoli in cui puoi offrire i tuoi servizi",
      questions: [
        {
          id: "zones",
          label: "",
          type: QuestionType.MULTI_CHECKBOX,
          options: [
            { label: "Centro Storico", value: "centro_storico" },
            { label: "Vomero", value: "vomero" },
            { label: "Chiaia", value: "chiaia" },
            { label: "Posilippo", value: "posilippo" },
            { label: "Fuorigrotta", value: "fuorigrotta" },
            { label: "Bagnoli", value: "bagnoli" },
            { label: "Pianura", value: "pianura" },
            { label: "Soccavo", value: "soccavo" },
            { label: "Arenella", value: "arenella" },
          ],
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
          id: "transportation",
          type: QuestionType.RADIO,
          label: "Mezzo di trasporto",
          options: [
            { label: "Auto", value: "auto" },
            { label: "Moto", value: "moto" },
            { label: "Bicicletta", value: "bike" },
            { label: "Trasporto pubblico", value: "public" },
            { label: "Nessuno", value: "none" },
            { label: "Altro", value: "other" },
          ],
          validation: {
            required: true,
          },
        },
      ],
      // Conditional routing based on transportation
      nextStep: "job",
    },
    {
      id: "job",
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
        const requiresDocs = [OccupationEnum.PROFESSIONAL]
        if (requiresDocs.includes(answers.occupation as OccupationEnum)) {
          return "professional-docs-info"
        }
        return "courses"
      },
    },
    {
      id: "professional-docs-info",
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
          id: "information",
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
          id: "exp",
          type: QuestionType.RADIO,
          label: "",
          options: [
            { label: "< 1 anno", value: "lt_1" },
            { label: "1-3 anni", value: "1-3_yrs" },
            { label: "3-5 anni", value: "3-5_yrs" },
            { label: "5+ anni", value: "gte_5" },
          ],
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
          id: "experience",
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
        //TODO: cambiare icone
        {
          id: "services",
          type: QuestionType.MULTI_CHECKBOX,
          label: "",
          options: [
            {
              label: "Compagnia e conversazione",
              value: "company",
              icon: ChatBubbleBottomCenterIcon,
            },
            {
              label: "Sorveglianza non sanitaria",
              value: "surveillance",
              icon: HeartIcon,
            },
            {
              label: "Aiuto negli spostamenti in casa",
              value: "moving",
              icon: NewspaperIcon,
            },
            {
              label: "Preparazione piatti semplici",
              value: "food",
              icon: FireIcon,
            },
            {
              label: "Riordino leggero di ambienti",
              value: "cleaning",
              icon: SparklesIcon,
            },
            {
              label: "Spese e piccole commissioni",
              value: "grocery",
              icon: ShoppingBagIcon,
            },
          ],
        },
      ],
      nextStep: "hygene",
    },
    {
      id: "hygene",
      title: "Ti occupi di igene personale?",
      description: "Seleziona tutto ciò in cui puoi aiutare",
      questions: [
        //TODO: icone
        {
          id: "services",
          label: "",
          type: QuestionType.MULTI_CHECKBOX,
          options: [
            {
              label: "Aiuto in bagno (lavarsi, vestirsi)",
              value: "bathroom_help",
              icon: HomeIcon,
            },
            {
              label: "Igiene a letto",
              value: "bed_help",
              icon: HomeIcon,
            },
            {
              label: "Cambio pannolone",
              value: "diaper_help",
              icon: HomeIcon,
            },
            {
              label: "No, non mi occupo di igiene personale",
              value: "none",
              icon: HomeIcon,
            },
          ],
        },
      ],
      nextStep: (answers) => {
        if (answers.services.includes("none")) {
          answers.services = answers.services.filter((s: string) => s == "none") //if "none" is selected, ignore everything else
        }
        return "outside"
      },
    },
    {
      id: "outside",
      title: "Puoi accompagnare fuori casa?",
      description: "Seleziona le attività di accompagnamento che offri",
      questions: [
        //TODO: icone
        {
          id: "outdoor_activities",
          label: "",
          type: QuestionType.MULTI_CHECKBOX,
          options: [
            {
              label: "Passeggiate",
              value: "walks",
              icon: HomeIcon,
            },
            {
              label: "Spesa al supermercato",
              value: "groceries",
              icon: HomeIcon,
            },
            {
              label: "Visite mediche / esami",
              value: "doctor_apps",
              icon: HomeIcon,
            },
            {
              label: "Accompagnamento in auto",
              value: "car_driving",
              icon: HomeIcon,
            },
            {
              label: "No, non accompagno fuori casa",
              value: "none",
              icon: HomeIcon,
            },
          ],
        },
      ],
      nextStep: (answers) => {
        if (answers.outside.includes("none")) {
          answers.outside = answers.outside.filter((s: string) => s == "none") //if "none" is selected, ignore everything else
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
          id: "exp",
          label: "",
          type: QuestionType.MULTI_CHECKBOX,
          options: [
            {
              label: "Anziani autosufficienti",
              value: "selfsufficient",
            },
            {
              label: "Anziani con mobilità ridotta",
              value: "reduced_mobility",
            },
            {
              label: "Anziani con carrozzina",
              value: "wheelchair",
            },
            {
              label: "Alzheimer / demenza",
              value: "alzheimer",
            },
            {
              label: "Parkinson",
              value: "parkinson",
            },
            {
              label: "Post-operatorio",
              value: "post-op",
            },
            {
              label: "Assistenza notturna",
              value: "night",
            },
            {
              label: "Nessuna",
              value: "none",
            },
          ],
        },
      ],
      nextStep: "service_type",
    },
    {
      id: "service_type",
      title: "Che tipo di servizio offri?",
      description: "Puoi selezionare più opzioni",
      questions: [
        {
          type: QuestionType.MULTI_CHECKBOX,
          label: "",
          id: "type",
          options: [
            { label: "A ore (giorno)", value: "hourly_day" },
            { label: "A ore (sera/notte)", value: "hourly_night" },
            { label: "Notte in presenza", value: "night" },
            { label: "Notte in sorveglianza", value: "night_away" },
          ],
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
          id: "time-committment",
          type: QuestionType.RADIO,
          label: "",
          options: [
            { label: "Fino a 10 ore", value: "lte_10" },
            { label: "10-20 ore", value: "gt_10_lt_20" },
            { label: "20-30 ore", value: "gt_20_lt_30" },
            { label: "30+ ore", value: "gt_30" },
          ],
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
          id: "urgent",
          type: QuestionType.RADIO,
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
          id: "char",
          type: QuestionType.MULTI_CHECKBOX,
          label: "",
          max: 3,
          options: [
            {
              label: "Molto paziente",
              value: "patient",
            },
            {
              label: "Tranquillo/a e riservato/a",
              value: "reserved",
            },
            {
              label: "Chiacchierone/a e socievole",
              value: "chatty",
            },
            {
              label: "Molto organizzato/a",
              value: "organized",
            },
            {
              label: "Molto puntuale",
              value: "ontime",
            },
          ],
        },
      ],
      nextStep: "languages",
    },
    {
      title: "Quali lingue parli?",
      description:
        "L'italiano è obbligatorio. Aggiungi altre lingue se ne parli.",
      id: "languages",
      questions: [
        {
          id: "char",
          type: QuestionType.SELECT_MULTI,
          label: "",
          options: [
            { label: "Italiano", value: "italian", icon: HomeIcon }, //TODO: add flags
            { label: "Inglese", value: "english" },
            { label: "Rumeno", value: "romanian" },
            { label: "Arabo", value: "arabic" },
            { label: "Albanese", value: "albanian" },
            { label: "Spagnolo", value: "spanish" },
            { label: "Francese", value: "french" },
            { label: "Cinese", value: "chinese" },
            { label: "Ucraino", value: "ukrainian" },
            { label: "Filippino (Tagalog)", value: "tagalog" },
            { label: "Hindi", value: "hindi" },
            { label: "Tedesco", value: "german" },
            { label: "Portoghese", value: "portuguese" },
            { label: "Bengalese", value: "bengali" },
            { label: "Russo", value: "russian" },
            { label: "Polacco", value: "polish" },
            { label: "Serbo", value: "serbian" },
            { label: "Urdu", value: "urdu" },
            { label: "Punjabi", value: "punjabi" },
            { label: "Persiano (Farsi)", value: "persian" },
            { label: "Altri", value: "other" },
          ],
        },
      ],
      nextStep: "propic",
    },
    {
      id: "propic",
      title: "Aggiungi una foto profilo",
      description: "Una foto sorridente aiuta le famiglie a conoscerti meglio.",
      questions: [
        {
          id: "photo",
          type: QuestionType.FILE, 
          label: "",
        },
      ],
    },
  ],
})
