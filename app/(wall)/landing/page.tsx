"use client";

import Link from "next/link";
import {
  CalendarDaysIcon,
  CheckBadgeIcon,
  ArrowPathIcon,
  CurrencyEuroIcon,
  CreditCardIcon,
  EyeIcon,
  DocumentTextIcon,
  HomeIcon,
  PhoneIcon,
  BoltIcon,
  ShieldCheckIcon,
  UsersIcon,
  ClockIcon,
  CalculatorIcon,
  BellIcon,
  WalletIcon,
  PlayIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import {
  LandingAccessGrid,
  LandingFaqCompact,
  LandingFinalCTA,
  LandingFooterAlt,
  LandingHeroCompact,
  LandingPricingHighlight,
  LandingServiceStack,
  LandingVerticalSteps,
} from "@/components/landing";

const pressLogos = ["IL MATTINO", "Linkiesta", "StartupItalia"];

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
];

const services = [
  {
    title: "Compagnia e supervisione",
    description: "Un Vigil presente per compagnia, ascolto e supervisione quotidiana.",
    image: "/assets/home_banner.png",
  },
  {
    title: "Supporto fisico e strutturato",
    description: "Aiuto nelle attività quotidiane e nella mobilità in sicurezza.",
    image: "/assets/home_banner.png",
  },
  {
    title: "Cura degli spazi domestici",
    description: "Piccole attività domestiche per mantenere l'ambiente in ordine e sereno.",
    image: "/assets/home_banner.png",
  },
  {
    title: "Accompagnamento visite",
    description: "Supporto negli spostamenti e nelle visite mediche, con aggiornamenti puntuali.",
    image: "/assets/home_banner.png",
  },
  {
    title: "Monitoraggio e sicurezza",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/assets/home_banner.png",
  },
  {
    title: "Supporto emotivo dedicato",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/assets/home_banner.png",
  },
];

const accessFeatures = [
  {
    icon: <span>🧠</span>,
    title: "Assegnazione intelligente",
    description: "Il sistema assegna automaticamente la persona più adatta alle tue esigenze (zona, competenze, disponibilità)",
  },
  {
    icon: <span>✓</span>,
    title: "Vigil verificati",
    description: "Operatori formati e verificati prima di iniziare a lavorare.",
  },
  {
    icon: <span>💳</span>,
    title: "Pagamento tracciato e sicuro",
    description: "Pagamenti tracciati e sicuri sia per te che per il Vigil.",
  },
  {
    icon: <span className="text-lg">↔️</span>,
    title: "Cambio Vigil dall'app",
    description: "Hai sempre un piano B e puoi richiedere un cambio in app.",
  },
  {
    icon: <span className="text-lg">📱</span>,
    title: "Gestione digitale",
    description: "Tutto è gestibile in app per avere accesso in qualsiasi momento e dispositivo.",
  },
];

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
];

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
];

const faqs = [
  {
    question: "Come vengono verificati i Vigil?",
    answer: "È la piattaforma digitale per trovare e gestire l'assistenza domiciliare con Vigil verificati.",
  },
  {
    question: "Quanto costa il servizio? ",
    answer: "Operatori selezionati, formati e verificati prima di iniziare a lavorare con te.",
  },
  {
    question: "Posso cambiare Vigil se non mi trovo bene?",
    answer: "Sì, puoi richiedere un cambio direttamente dall'app in qualsiasi momento.",
  },
  {
    question: "Cosa succede se l'assistente annulla?",
    answer: "Paghi in modo tracciato e sicuro dall'app, senza costi nascosti né vincoli.",
  },
  {
    question: "In quali zone è attivo il servizio?",
    answer: "Bastano pochi minuti: questionario, scelta dei Vigil e conferma del preventivo.",
  },
  {
    question: "C'è un impegno minimo?",
    answer: "Puoi sospendere o disdire quando vuoi, senza penali.",
  },
];

const primaryLinks = [
  { label: "Aggiungi la password", href: "/login" },
  { label: "Nuova prenotazione Vigil", href: "/signup" },
  { label: "Profilo Vigil", href: "/vigil" },
];

const infoLinks = [
  { label: "Chi siamo", href: "/" },
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Cookie policy", href: "/cookie-policy" },
];

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "Instagram", href: "https://www.instagram.com" },
];

export default function LandingPage() {
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
          href: "/signup",
          variant: "primary",
        }}
        secondaryCTA={{
          label: "Diventa un Vigil",
          href: "/vigil/signup",
          variant: "secondary",
        }}
        trustBadges={trustBadges}
        imageSrc="/assets/home_banner-2.png"
        imageAlt="Famiglia assistita"
        pressLogos={pressLogos}
      />

      <section className="bg-white px-4 pb-16 pt-10">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-xl">
            I <span className="text-vigil-orange"> servizi offerti </span> dai
            nostri <span className="text-consumer-blue">Vigil</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Fidati dei nostri Vigil. Sono stati formati e selezionati per
            garantire sempre la serenità.
          </p>
        </div>
        <LandingServiceStack
          services={services}
          cardHeight={340}
          className="my-12 px-10"
        />
      </section>

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
        className="bg-gradient-to-b from-consumer-light-blue/60 to-white"
      />

      <LandingPricingHighlight
        label="Calcola il tuo preventivo"
        title={`Scopri quanto costa il servizio`}
        subtitle="Calcola in pochi secondi un preventivo approssimativo per l'assistenza di cui hai bisogno. Nessun impegno, nessuna email richiesta."
        buttonLabel="Calcola il preventivo"
        buttonHref="/signup"
        highlights={pricingHighlights}
      />

      <LandingVerticalSteps
        label="Semplice e veloce"
        title="Come funziona Vigila"
        subtitle="Sei passi per trovare l'assistenza perfetta per i tuoi cari"
        steps={steps}
        className="bg-gradient-to-b from-white via-consumer-light-blue/20 to-white"
      />

      <div className="px-4 pb-10 text-center">
        <Link
          href="/signup"
          className="inline-flex gap-3 items-center justify-center rounded-full bg-vigil-orange px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-vigil-orange/90"
        >
          Rispondi al questionario <ArrowRightIcon className="w-4" />
        </Link>
        <p className="mt-2 text-sm text-consumer-blue font-semibold">
          Hai urgenza? Assistenza prioritaria
        </p>
      </div>

      <section className="bg-gradient-to-b from-[#ffe7de] via-white to-[#e6f7ff]">
        <LandingFaqCompact
          label="Domande frequenti"
          title="Hai delle domande?"
          subtitle="Trovi le risposte più frequenti sul servizio e su come funziona."
          faqs={faqs}
          className="text-white"
        />
        <LandingFinalCTA
          headline={
            <>
              Con Vigila finalmente non devi risolvere tutto da solo
            </>
          }
          description="Con un team di esperti che si occupa di tutte le fasi e l'app assistenziale per gestire da remoto chi ami."
          bullets={[
            { text: "A partire da 9€ l'ora", icon: "✓" },
            { text: "Disdici quando vuoi", icon: "✓" },
          ]}
          primaryLabel="Avvia la prova"
          primaryHref="/signup"
          secondaryLabel="Diventa un Vigil"
          secondaryHref="/vigil/signup"
          helper="Se non hai bisogno dell'assistenza puoi disdire, avrai report e supporto dedicato."
          className="pt-0"
        />
      </section>

      <LandingFooterAlt
        primaryLinks={primaryLinks}
        infoLinks={infoLinks}
        contactEmail="ciao@vigila.app"
        socialLinks={socialLinks}
      />
    </main>
  )
}
