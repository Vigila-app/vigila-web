"use client";

import Link from "next/link";
import {
  CurrencyEuroIcon,
  HomeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  LandingAccessGrid,
  LandingFaqCompact,
  LandingFinalCTA,
  LandingFooterAlt,
  LandingHeaderBar,
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
    badge: "A partire da 9€/h",
    title: "Compagnia e supervisione",
    description:
      "Supporto emotivo e presenza attiva per garantire benessere e sicurezza quotidiana.",
    image: "/assets/home_banner.png",
  },
  {
    badge: "A partire da 10€/h",
    title: "Supporto fisico e strutturato",
    description:
      "Assistenza pratica per attività quotidiane, mobilità e gestione della routine.",
    image: "/assets/home_banner.png",
  },
];

const accessFeatures = [
  {
    icon: <span className="text-lg">🎯</span>,
    title: "Assegnazione intelligente",
    description:
      "Il sistema ti indica da subito la persona più adatta alle esigenze della persona da assistere.",
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
    icon: <span>🔄</span>,
  },
  {
    title: "Trasparente",
    description: "Sai sempre quanto spendi, senza sorprese né vincoli.",
    accentColor: "blue" as const,
    icon: <span>👁️</span>,
  },
  {
    title: "Immediato",
    description: "Calcolo reale delle ore richieste e del costo.",
    accentColor: "teal" as const,
    icon: <span>⚡</span>,
  },
];

const steps = [
  {
    title: "Compila il questionario",
    description: "Rispondi a domande pre compilate in 3 minuti.",
  },
  {
    title: "Programma l'assistenza",
    description:
      "Indica giorni, orari e frequenza (settimanale, trisettimanale, quotidiana o H24).",
  },
  {
    title: "Scegli i tuoi Vigil",
    description: "Scegli tra i Vigil proposti dal sistema.",
  },
  {
    title: "Attendi conferma",
    description: "Calcolo automatico e assegnazione.",
  },
  {
    title: "Paga in sicurezza",
    description: "Pagamento sicuro in app o con carta.",
  },
  {
    title: "Inizia con il Vigil",
    description: "Ti affidi a personale qualificato e verificato.",
  },
];

const faqs = [
  {
    question: "Come vengono scelti i Vigil?",
    answer:
      "Sono selezionati tramite questionario, colloquio e verifica delle competenze prima di entrare in servizio.",
  },
  {
    question: "Come avviene un imprevisto?",
    answer:
      "In caso di imprevisto il sistema ti propone subito un sostituto disponibile con le stesse competenze.",
  },
  {
    question: "Posso avere più assistenti?",
    answer: "Sì, puoi configurare più assistenti per coprire turni o esigenze diverse.",
  },
  {
    question: "Posso chiedere un cambio Vigil?",
    answer: "Puoi cambiare Vigil in qualsiasi momento direttamente dall'app.",
  },
  {
    question: "Qual è il costo del servizio?",
    answer:
      "Il costo parte da 9€/h per la compagnia e 10€/h per il supporto strutturato. Calcola il preventivo personalizzato.",
  },
  {
    question: "Voi vi occupate dei pagamenti?",
    answer:
      "Sì, i pagamenti sono gestiti e tracciati dalla piattaforma per darti sicurezza e trasparenza.",
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
      <LandingHeaderBar
        logoSrc="/assets/logo.png"
        badgeLabel="ACCE"
        actions={[
          {
            label: "Accedi",
            href: "/login",
            variant: "secondary",
            icon: <UserIcon className="h-4 w-4" />,
          },
          {
            label: "Richiedi aiuto",
            href: "/signup",
            variant: "primary",
            icon: <PhoneIcon className="h-4 w-4" />,
          },
        ]}
      />

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
        appointmentCTA={{
          label: "Prenota una call",
          href: "/signup",
          helper: "Prenota un appuntamento per la tua assistenza",
          icon: <PhoneIcon className="h-4 w-4" />,
        }}
        imageSrc="/assets/home_banner.png"
        imageAlt="Famiglia assistita"
        pressLogos={pressLogos}
      />

      <section className="bg-white px-4 pb-12 pt-6">
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
        <LandingServiceStack services={services} cardHeight={320} className="mt-8" />
      </section>

      <LandingAccessGrid
        label="Pricing e preventivo"
        title={`Con Vigila hai <br /> accesso a`}
        subtitle="Tutto ciò che ti serve per gestire l'utente in modo semplice."
        features={accessFeatures}
        className="bg-gradient-to-b from-consumer-light-blue/60 to-white"
      />

      <LandingPricingHighlight
        title={`Scopri quanto costa il servizio`}
        subtitle="Calcola il preventivo personalizzato. Scegli il pacchetto che fa per te. Costo trasparente, senza vincoli, senza imprevisti."
        buttonLabel="Richiedi preventivo"
        buttonHref="/signup"
        highlights={pricingHighlights}
      />

      <LandingVerticalSteps
        label="Semplice e veloce"
        title="Come funziona Vigila"
        subtitle="In pochi passaggi ti aiuta a scegliere la soluzione migliore per i tuoi cari."
        steps={steps}
        className="bg-gradient-to-b from-white via-consumer-light-blue/20 to-white"
      />

      <div className="px-4 pb-10 text-center">
        <Link
          href="/signup"
          className="inline-flex items-center justify-center rounded-full bg-vigil-orange px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-vigil-orange/90"
        >
          Richiedi un preventivo
        </Link>
        <p className="mt-2 text-xs text-gray-500">
          Hai bisogno di assistenza continuativa? Richiedi un piano assistenziale personalizzato.
        </p>
      </div>

      <section className="bg-gradient-to-b from-[#f26b4f] via-white to-[#00b7df]">
        <LandingFaqCompact
          label="Rispondiamo in chat"
          title="Hai delle domande?"
          subtitle="Ecco le domande più frequenti sul servizio e come funziona."
          faqs={faqs}
          className="text-white"
        />
        <LandingFinalCTA
          headline={`Con Vigila<br />finalmente non<br />devi risolvere<br />tutto da solo`}
          description="Con un team di esperti che si occupa di tutte le fasi e grazie all'app assistenziale per gestire da remoto familiari a cui dare supporto."
          bullets={["A partire da 9€ l'ora", "Disdici quando vuoi"]}
          primaryLabel="Avvia la prova"
          primaryHref="/signup"
          secondaryLabel="Diventa un Vigil"
          secondaryHref="/vigil/signup"
          helper="Prova gratis e subito il servizio"
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
