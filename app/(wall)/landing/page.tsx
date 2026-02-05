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
    icon: <span className="text-lg">🎯</span>,
    title: "Assegnazione intelligente",
    description: "Il sistema ti indica da subito il Vigil più adatto alle esigenze.",
  },
  {
    icon: <span className="text-lg">✓</span>,
    title: "Vigil verificati",
    description: "Operatori formati e verificati prima di iniziare a lavorare.",
  },
  {
    icon: <span className="text-lg">💳</span>,
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
    description: "Scegli tu le ore, la frequenza e il Vigil più adatto.",
    accentColor: "orange" as const,
    icon: <ArrowPathIcon className="h-5 w-5 text-consumer-blue" />,
  },
  {
    title: "Trasparente",
    description: "Sai sempre quanto spendi, senza sorprese né vincoli.",
    accentColor: "blue" as const,
    icon: <EyeIcon className="h-5 w-5 text-vigil-orange" />,
  },
  {
    title: "Immediato",
    description: "Calcolo reale delle ore richieste e del costo.",
    accentColor: "teal" as const,
    icon: <BoltIcon className="h-5 w-5 text-consumer-blue" />,
  },
];

const steps = [
  {
    icon: <DocumentTextIcon className="h-5 w-5" />,
    tone: "blue" as const,
    title: "Compila il questionario",
    description: "3 minuti per raccontarci bisogni e orari di assistenza.",
  },
  {
    icon: <CalendarDaysIcon className="h-5 w-5" />,
    tone: "blue" as const,
    title: "Programma l'assistenza",
    description: "Puoi fare prove: trisettimanale, quotidiana o 24/7, lo scegli tu.",
  },
  {
    icon: <UsersIcon className="h-5 w-5" />,
    tone: "blue" as const,
    title: "Scegli i tuoi Vigil",
    description: "Il sistema ti indica i profili migliori per te, puoi selezionarli.",
  },
  {
    icon: <CheckBadgeIcon className="h-5 w-5" />,
    tone: "orange" as const,
    title: "Attendi conferma",
    description: "Calcolo automatico del preventivo e assegnazione del Vigil.",
  },
  {
    icon: <CreditCardIcon className="h-5 w-5" />,
    tone: "orange" as const,
    title: "Paga in sicurezza",
    description: "Vedi il prezzo subito e paghi solo quando confermi.",
  },
  {
    icon: <PhoneIcon className="h-5 w-5" />,
    tone: "orange" as const,
    title: "Inizia con il Vigil",
    description: "Match automatizzato e rapido, inizi quando ne hai bisogno.",
  },
];

const faqs = [
  {
    question: "Cos'è Vigila?",
    answer: "È la piattaforma digitale per trovare e gestire l'assistenza domiciliare con Vigil verificati.",
  },
  {
    question: "Chi sono i Vigil?",
    answer: "Operatori selezionati, formati e verificati prima di iniziare a lavorare con te.",
  },
  {
    question: "Posso cambiare Vigil se non mi trovo bene?",
    answer: "Sì, puoi richiedere un cambio direttamente dall'app in qualsiasi momento.",
  },
  {
    question: "Come funziona il pagamento?",
    answer: "Paghi in modo tracciato e sicuro dall'app, senza costi nascosti né vincoli.",
  },
  {
    question: "Quanto tempo serve per attivare il servizio?",
    answer: "Bastano pochi minuti: questionario, scelta dei Vigil e conferma del preventivo.",
  },
  {
    question: "Posso sospendere il servizio?",
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
            Quando non
            <br />
            puoi esserci tu,
            <br />
            c'è Vigila
          </>
        }
        description="Il servizio digitale che ti aiuta a trovare e gestire l'assistenza per i tuoi cari con persone verificate nella tua zona."
        primaryCTA={{
          label: "Ti aiuta ad aiutare",
          href: "/signup",
          variant: "primary",
        }}
        secondaryCTA={{
          label: "Diventa un Vigil",
          href: "/vigil/signup",
          variant: "secondary",
        }}
        trustBadges={trustBadges}
        imageSrc="/assets/home_banner.png"
        imageAlt="Famiglia assistita"
        pressLogos={pressLogos}
      />

      <section className="bg-white px-4 pb-16 pt-10">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            I servizi offerti dai
            <br />
            nostri <span className="text-consumer-blue">Vigil</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Fidati dei nostri Vigil. Sono stati formati e selezionati per garantire sempre la serenità.
          </p>
        </div>
        <LandingServiceStack services={services} cardHeight={340} className="mt-12" />
      </section>

      <LandingAccessGrid
        label="Perché scegliere Vigila"
        labelColor="orange"
        title={`Con Vigila hai <br /> accesso a`}
        subtitle="Tutto ciò che ti serve per gestire l'assistenza in modo semplice."
        features={accessFeatures}
        className="bg-gradient-to-b from-consumer-light-blue/60 to-white"
      />

      <LandingPricingHighlight
        label="Calcola il tuo preventivo"
        title={`Scopri quanto costa il servizio`}
        subtitle="Preventivo personalizzato, senza vincoli e con costi trasparenti."
        buttonLabel="Calcola il preventivo"
        buttonHref="/signup"
        highlights={pricingHighlights}
      />

      <LandingVerticalSteps
        label="Semplice e veloce"
        title="Come funziona Vigila"
        subtitle="In pochi passaggi scegli la soluzione migliore per chi ami."
        steps={steps}
        className="bg-gradient-to-b from-white via-consumer-light-blue/20 to-white"
      />

      <div className="px-4 pb-10 text-center">
        <Link
          href="/signup"
          className="inline-flex items-center justify-center rounded-full bg-vigil-orange px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-vigil-orange/90"
        >
          Prenota e hai accesso
        </Link>
        <p className="mt-2 text-xs text-gray-500">
          Hai bisogno di assistenza continuativa? Richiedi un piano personalizzato.
        </p>
      </div>

      <section className="bg-gradient-to-b from-[#ffe7de] via-white to-[#e6f7ff]">
        <LandingFaqCompact
          label="Consultaci ogni volta"
          title="Hai delle domande?"
          subtitle="Trovi le risposte più frequenti sul servizio e su come funziona."
          faqs={faqs}
          className="text-white"
        />
        <LandingFinalCTA
          headline={`Con Vigila<br />finalmente non<br />devi risolvere<br />tutto da solo`}
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
  );
}
