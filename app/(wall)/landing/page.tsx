"use client";

import React from "react";
import {
  LandingHero,
  LandingFeatures,
  LandingHowItWorks,
  LandingStats,
  LandingTestimonials,
  LandingCTA,
  LandingFAQ,
  LandingImageSlider,
  LandingGetInTouch,
  LandingCostEstimator,
} from "@/components/landing";
// import Footer from "@/components/footer/footer";
import {
  HeartIcon,
  ShieldCheckIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

export default function LandingPage() {
  const features = [
    {
      icon: <HeartIcon className="w-8 h-8" />,
      title: "Assistenza di Qualità",
      description:
        "Vigil qualificati e verificati pronti ad aiutarti con professionalità e dedizione.",
    },
    {
      icon: <ClockIcon className="w-8 h-8" />,
      title: "Disponibilità Immediata",
      description:
        "Trova un Vigil in pochi secondi, quando ne hai bisogno, 24/7.",
    },
    {
      icon: <MapPinIcon className="w-8 h-8" />,
      title: "Nella Tua Zona",
      description:
        "Vigil del tuo quartiere per un servizio personalizzato e di fiducia.",
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Sicurezza Garantita",
      description:
        "Tutti i Vigil sono verificati, assicurati e valutati dalla community.",
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: "Community Affidabile",
      description:
        "Una rete di persone che si aiutano creando legami autentici.",
    },
    {
      icon: <StarIcon className="w-8 h-8" />,
      title: "Recensioni Verificate",
      description:
        "Scegli basandoti su esperienze reali condivise dalla nostra community.",
    },
  ];

  const steps = [
    {
      stepNumber: 1,
      title: "Crea il Tuo Account",
      description:
        "Registrati in pochi secondi e completa il tuo profilo per iniziare.",
    },
    {
      stepNumber: 2,
      title: "Cerca il Vigil Perfetto",
      description:
        "Esplora i profili disponibili nella tua zona e leggi le recensioni.",
    },
    {
      stepNumber: 3,
      title: "Prenota e Rilassati",
      description:
        "Conferma la prenotazione e goditi l'assistenza di cui hai bisogno.",
    },
  ];

  const stats = [
    { value: "5000", suffix: "+", label: "Famiglie Servite" },
    { value: "1000", suffix: "+", label: "Vigil Attivi" },
    { value: "50", suffix: "+", label: "Città Coperte" },
    { value: "4.8", suffix: "/5", label: "Rating Medio" },
  ];

  const testimonials = [
    {
      name: "Maria Rossi",
      role: "Madre di famiglia",
      content:
        "Vigila ha cambiato la mia vita! Finalmente posso contare su assistenza affidabile per mia madre. I Vigil sono professionali e gentili.",
      avatar: "MR",
      rating: 5,
    },
    {
      name: "Giovanni Bianchi",
      role: "Caregiver familiare",
      content:
        "Il servizio è eccellente. Trovare un Vigil nella mia zona è stato facilissimo e il supporto ricevuto è stato oltre le aspettative.",
      avatar: "GB",
      rating: 5,
    },
    {
      name: "Laura Verdi",
      role: "Senior",
      content:
        "Mi sento al sicuro sapendo che posso trovare aiuto in qualsiasi momento. I Vigil sono come una famiglia allargata.",
      avatar: "LV",
      rating: 5,
    },
  ];

  const slides = [
    {
      image: "/assets/home_banner.png",
      alt: "Vigila - Un ponte tra generazioni",
      title: "Assistenza Domiciliare",
      description: "Professionisti qualificati al tuo servizio",
    },
    {
      image: "/assets/home_banner.png",
      alt: "Community Vigila",
      title: "Una Community di Fiducia",
      description: "Migliaia di famiglie già ci scelgono ogni giorno",
    },
    {
      image: "/assets/home_banner.png",
      alt: "Vigil Certificati",
      title: "Vigil Verificati",
      description: "Tutti i nostri Vigil sono certificati e assicurati",
    },
  ];

  const faqs = [
    {
      question: "Come funziona Vigila?",
      answer:
        "Vigila è una piattaforma che mette in contatto famiglie con assistenti qualificati (Vigil) nella tua zona. Basta registrarsi, cercare un Vigil adatto alle tue esigenze e prenotare il servizio direttamente dalla piattaforma.",
    },
    {
      question: "I Vigil sono verificati?",
      answer:
        "Sì, tutti i Vigil sulla nostra piattaforma sono accuratamente verificati. Controlliamo documenti, referenze e certificazioni professionali. Inoltre, tutti i Vigil sono assicurati per garantire la massima sicurezza.",
    },
    {
      question: "Quanto costa il servizio?",
      answer:
        "I costi variano in base al tipo di servizio richiesto e alla durata. Puoi visualizzare le tariffe direttamente nei profili dei Vigil. Non ci sono costi nascosti e paghi solo per i servizi effettivamente utilizzati.",
    },
    {
      question: "Posso cancellare una prenotazione?",
      answer:
        "Sì, puoi cancellare una prenotazione seguendo la nostra politica di cancellazione. Le cancellazioni effettuate con almeno 24 ore di anticipo ricevono un rimborso completo.",
    },
    {
      question: "Come posso diventare un Vigil?",
      answer:
        "Per diventare un Vigil, clicca su 'Diventa un Vigil' e completa il processo di registrazione. Dovrai fornire documenti, certificazioni professionali e superare un processo di verifica. Una volta approvato, potrai iniziare a offrire i tuoi servizi sulla piattaforma.",
    },
  ];

  const handleContactSubmit = async (data: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }) => {
    console.log("Contact form submitted:", data);
    // Here you would typically send the data to your backend
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <main className="min-h-screen">
      <LandingHero
        title="L'assistenza del tuo quartiere a portata di click"
        subtitle="Un ponte tra generazioni"
        description="Con Vigila trovi in pochi secondi un Vigil di fiducia, proprio nella tua zona. Creiamo connessioni autentiche che arricchiscono la vita di giovani e anziani."
        primaryButtonText="Inizia Ora"
        primaryButtonHref="/signup"
        secondaryButtonText="Scopri di Più"
        secondaryButtonHref="#features"
        imageSrc="/assets/home_banner.png"
        imageAlt="Vigila - Un ponte tra generazioni"
      />

      <LandingImageSlider slides={slides} autoPlay autoPlayInterval={4000} />

      <div id="features">
        <LandingFeatures
          sectionTitle="Perché Scegliere Vigila"
          sectionSubtitle="La nostra missione è creare una community dove l'assistenza di qualità è accessibile a tutti."
          features={features}
        />
      </div>

      <LandingHowItWorks
        sectionTitle="Come Funziona"
        sectionSubtitle="Inizia il tuo viaggio con Vigila in tre semplici passi"
        steps={steps}
      />

      <LandingStats
        sectionTitle="Vigila in Numeri"
        sectionSubtitle="La fiducia della nostra community ci guida ogni giorno"
        stats={stats}
      />

      <LandingCostEstimator
        sectionTitle="Calcola il Tuo Costo Mensile"
        sectionSubtitle="Scopri quanto potresti spendere per l'assistenza di cui hai bisogno"
        minHours={8}
        maxHours={160}
        defaultHours={40}
        hourlyRate={9}
        benefits={[
          "Assistenti verificati e qualificati",
          "Pagamento sicuro tramite piattaforma",
          "Supporto clienti dedicato 7/7",
          "Possibilità di modificare le prenotazioni",
        ]}
      />

      <LandingTestimonials
        sectionTitle="Cosa Dicono di Noi"
        sectionSubtitle="Le storie della nostra community sono la nostra motivazione"
        testimonials={testimonials}
      />

      <LandingFAQ
        sectionTitle="Domande Frequenti"
        sectionSubtitle="Trova le risposte alle domande più comuni su Vigila"
        faqs={faqs}
        defaultOpenIndex={0}
      />

      <LandingGetInTouch
        sectionTitle="Contattaci"
        sectionSubtitle="Hai domande? Siamo qui per aiutarti. Inviaci un messaggio e ti risponderemo al più presto."
        onSubmit={handleContactSubmit}
      />

      <LandingCTA
        title="Pronto a Iniziare?"
        subtitle="Unisciti a migliaia di famiglie che hanno trovato l'assistenza perfetta con Vigila"
        buttonText="Registrati Gratis"
        buttonHref="/signup"
        secondaryButtonText="Diventa un Vigil"
        secondaryButtonHref="/vigil/signup"
      />

      {/* Footer will be added once environment is configured */}
    </main>
  );
}
