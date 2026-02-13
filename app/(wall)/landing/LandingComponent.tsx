"use client"
import {
  CalendarDaysIcon,
  ArrowPathIcon,
  CurrencyEuroIcon,
  DocumentTextIcon,
  HomeIcon,
  ShieldCheckIcon,
  UsersIcon,
  ClockIcon,
  CalculatorIcon,
  BellIcon,
  WalletIcon,
  PlayIcon,
  UserPlusIcon,
  CalendarIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline"
import {
  LandingAccessGrid,
  LandingCostEstimator,
  LandingFaqCompact,
  LandingFinalCTA,
  LandingHeroCompact,
  LandingPricingHighlight,
  LandingServiceStack,
  LandingVerticalSteps,
} from "@/components/landing"
import { AppConstants } from "@/src/constants"
import { Routes } from "@/src/routes"

const pressMentions = [
  { name: "Arena Digitale", logoSrc: "/assets/arena%20digitale.png" },
  {
    name: "Il Mattino",
    href: "https://www.ilmattino.it/",
    logoSrc: "/assets/il%20mattino.png",
  },
  { name: "Festival", logoSrc: "/assets/festival.png" },
]

const trustBadges = [
  {
    icon: <ShieldCheckIcon className="h-5 w-5 text-consumer-blue" />,
    label: "Vigil verificati",
  },
  {
    icon: <HomeIcon className="h-5 w-5 text-vigil-orange" />,
    label: "Nella tua zona",
  },
  {
    icon: <CurrencyEuroIcon className="h-5 w-5 text-consumer-blue" />,
    label: "Pagamenti sicuri",
  },
]

const services = [
  {
    title: "Accompagnamento in auto",
    description: "Visite mediche, terapie, disbrigo pratiche",
    image: "/assets/service_card_4.png",
  },
  {
    title: "Igiene personale",
    description: "Doccia, igiene a letto e cura personale",
    image: "/assets/service_card_3.png",
  },
  {
    title: "Compagnia e supervisione",
    description: "Presenza, conversazione e monitoraggio leggere",
    image: "/assets/service_card_1.png",
  },
  {
    title: "Spesa e commissioni",
    description: "Farmacia, supermercato e piccole commissioni",
    image: "/assets/service_card_2.png",
  },
  {
    title: "Assistenza leggera in casa",
    description: "Pasti, mobilità, vestizione, rassetto, farmaci",
    image: "/assets/service_card_5.png",
  },
]

const accessFeatures = [
  {
    icon: <SparklesIcon />, //TODO add brain icon
    title: "Assegnazione intelligente",
    description:
      "Il sistema assegna automaticamente la persona più adatta alle tue esigenze (zona, competenze, disponibilità)",
  },
  {
    icon: <ShieldCheckIcon />,
    title: "Vigil verificati",
    description:
      "+100 assistenti verificati in piattaforma con documenti, profilo, foto e recensioni",
  },
  {
    icon: <CalendarIcon />,
    title: "Calendario integrato",
    description:
      "Programma l'assistenza in app e tieni tutto sotto controllo grazie al calendario.",
  },
  {
    icon: <ArrowPathIcon />,
    title: "Sostituzioni automatiche",
    description:
      "L'algoritmo inizia subito la ricerca di un sostituto se l'assistente annulla la visita.",
  },
  {
    icon: <WalletIcon />,
    title: "Pagamenti tracciati",
    description:
      "Prezzi chiari, nessun costo aggiuntivo. Traccia tutti i movimenti con il portafoglio digitale",
  },
  {
    icon: <UserPlusIcon />,
    title: "Cambio assistente facile",
    description:
      "Recensisci l'assistente e richiedi il cambio se non ti trovi bene",
  },
]

const pricingHighlights = [
  {
    title: "Flessibile",
    description: "Scegli tu le ore e i giorni in base alle tue necessità",
    accentColor: "orange" as const,
    icon: <ClockIcon className="h-5 w-5" />,
  },
  {
    title: "Trasparente",
    description: "Prezzi chiari, nessun costo nascosto o sorpresa",
    accentColor: "blue" as const,
    icon: <CurrencyEuroIcon className="h-5 w-5" />,
  },
  {
    title: "Immediato",
    description: "Calcola subito il costo senza impegno",
    accentColor: "orange" as const,
    icon: <CalculatorIcon className="h-5 w-5" />,
  },
]

const steps = [
  {
    icon: <DocumentTextIcon className="h-5 w-5" />,
    tone: "blue" as const,
    title: "Compila il questionario",
    description: "Raccontaci le tue esigenze in pochi minuti ",
  },
  {
    icon: <CalendarDaysIcon className="h-5 w-5" />,
    tone: "blue" as const,
    title: "Programma l'assistenza",
    description: "Scegli i giorni, orari e servizi di cui hai bisogno",
  },
  {
    icon: <UsersIcon className="h-5 w-5" />,
    tone: "blue" as const,
    title: "Scegli i tuoi Vigil",
    description: "Seleziona tra gli assistenti disponibili nella tua zona",
  },
  {
    icon: <BellIcon className="h-5 w-5" />,
    tone: "orange" as const,
    title: "Attendi conferma",
    description: "L'assistente confermerà la disponibilità",
  },
  {
    icon: <WalletIcon className="h-5 w-5" />,
    tone: "orange" as const,
    title: "Paga in sicurezza",
    description: "Carica il portafoglio digitale e paga in modo tracciato",
  },
  {
    icon: <PlayIcon className="h-5 w-5" />,
    tone: "orange" as const,
    title: "Inizia subito",
    description: "Contatta l'assistente e inizia il servizio",
  },
]

const faqs = [
  {
    question: "Come vengono verificati i Vigil?",
    answer:
      "Ogni Vigil passa attraverso un processo di verifica completo che include controllo documenti, colloquio conoscitivo, verifica referenze e formazione iniziale. Solo dopo aver superato tutti i controlli possono accedere alla piattaforma.",
  },
  {
    question: "Quanto costa il servizio? ",
    answer:
      "I prezzi variano in base al tipo di servizio e alla durata. Puoi vedere i costi chiari prima di prenotare, senza costi nascosti. Paghi solo per le visite effettuate tramite il portafoglio digitale.",
  },
  {
    question: "Posso cambiare Vigil se non mi trovo bene?",
    answer:
      "Assolutamente sì. Puoi lasciare una recensione e richiedere un cambio assistente in qualsiasi momento. Il nostro algoritmo troverà subito un sostituto compatibile con le tue esigenze.",
  },
  {
    question: "Cosa succede se l'assistente annulla?",
    answer:
      "In caso di cancellazione da parte dell'assistente, il nostro algoritmo inizia immediatamente la ricerca di un sostituto. Verrai avvisato tempestivamente e potrai approvare il nuovo Vigil proposto.",
  },
  {
    question: "In quali zone è attivo il servizio?",
    answer:
      "Vigila è attivo in diverse città italiane e stiamo espandendo continuamente la nostra copertura. Compila il questionario per verificare la disponibilità nella tua zona.",
  },
  {
    question: "C'è un impegno minimo?",
    answer:
      "No, non c'è nessun impegno mensile obbligatorio. Carichi il portafoglio digitale e prenoti solo le visite che ti servono, quando ne hai bisogno.",
  },
]

export default function LandingComponent() {
  return (
    <main className="min-h-screen bg-white">
      <LandingHeroCompact
        headline={
          <>
            Quando non puoi esserci tu, c'è{" "}
            <span className="text-consumer-blue"> Vigila </span>
          </>
        }
        description="Il servizio digitale che ti aiuta a trovare e gestire l'assistenza per i tuoi cari, con persone verificate nella tua zona."
        primaryCTA={{
          label: "Richiedi assistenza",
          href: Routes.registrationConsumer.url,
          variant: "primary",
        }}
        secondaryCTA={{
          label: "Diventa un Vigil",
          href: Routes.registrationVigil.url,
          variant: "secondary",
        }}
        trustBadges={trustBadges}
        imageSrc="/assets/home_banner-2.png"
        imageAlt="Famiglia assistita"
        pressMentions={pressMentions}
      />

      <LandingServiceStack
        services={services}
        cardHeight={340}
        className="px-10"
      />

      <LandingAccessGrid
        label="Perché scegliere Vigila"
        labelColor="orange"
        title={
          <>
            Con <span className="text-consumer-blue"> Vigila </span> hai accesso
            a
          </>
        }
        subtitle="Tutto ciò di cui hai bisogno per gestire l'assistenza in modo semplice e sicuro."
        features={accessFeatures}
        className=""
      />

      <LandingPricingHighlight
        label="Calcola il tuo preventivo"
        title={`Scopri quanto costa il servizio`}
        subtitle="Calcola in pochi secondi un preventivo approssimativo per l'assistenza di cui hai bisogno. Nessun impegno, nessuna email richiesta."
        buttonLabel="Calcola il preventivo"
        buttonHref="#cost-estimator"
        highlights={pricingHighlights}
      />

      <LandingCostEstimator
        id="cost-estimator"
        sectionTitle="Calcola il tuo preventivo"
        sectionSubtitle="Stima subito un costo mensile indicativo in base alle ore di assistenza di cui hai bisogno."
        hourlyRate={9}
        minHours={8}
        maxHours={200}
        defaultHours={40}
      />

      <LandingVerticalSteps
        label="Semplice e veloce"
        title="Come funziona Vigila"
        subtitle="Sei passi per trovare l'assistenza perfetta per i tuoi cari"
        steps={steps}
        className="bg-gradient-to-b from-white via-consumer-light-blue/20 to-white"
      />

      <LandingFaqCompact
        label="Domande frequenti"
        title="Hai delle domande?"
        subtitle="Trovi le risposte più frequenti sul servizio e su come funziona."
        faqs={faqs}
        className="text-white"
      />
      <LandingFinalCTA
        headline={<>Con Vigila finalmente non devi risolvere tutto da solo</>}
        description="Parti con 1-2 settimane di prova. È il modo più semplice per capire se Vigila ti fa davvero stare più tranquillo."
        bullets={[
          {
            text: "Nessun impegno mensile all'avvio",
            icon: <ShieldCheckIcon />,
          },
          { text: "Ci vogliono solo 3 minuti", icon: <ClockIcon /> },
        ]}
        primaryLabel="Avvia la prova"
        primaryHref={AppConstants.whatsappUrl}
        secondaryLabel="Contatta il team"
        secondaryHref={AppConstants.whatsappUrl}
        className="pt-0"
      />
    </main>
  )
}
