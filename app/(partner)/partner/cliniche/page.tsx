"use client";

import { useState } from "react";
import {
  CalendarDaysIcon,
  ArrowPathIcon,
  BuildingOffice2Icon,
  HomeIcon,
  LinkIcon,
  CurrencyEuroIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import PartnerNav from "@/components/partner/PartnerNav";
import PartnerFooter from "@/components/partner/PartnerFooter";
import PartnerCredentials from "@/components/partner/PartnerCredentials";
import PartnerWaitlistFormCliniche from "@/components/partner/PartnerWaitlistFormCliniche";
import clsx from "clsx";

/* ─── Mockup UI: Booking caregiver ──────────────────────────────── */
const BookingMockup = () => (
  <div className="rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
    <div className="bg-vigil-orange px-4 py-3 flex items-center justify-between">
      <span className="text-white text-xs font-semibold">
        Prenota un caregiver
      </span>
      <span className="text-white/60 text-[10px]">Portale Clinica</span>
    </div>
    <div className="p-4 space-y-3">
      <div>
        <div className="text-[10px] font-semibold text-gray-500 uppercase mb-1">
          Tipo di servizio
        </div>
        <div className="flex gap-2">
          {["Accompagnamento", "Post-esame", "Sorveglianza"].map((s, i) => (
            <span
              key={s}
              className={`text-[10px] rounded-full px-2.5 py-1 font-semibold border ${
                i === 0
                  ? "bg-vigil-orange text-white border-vigil-orange"
                  : "bg-gray-50 text-gray-500 border-gray-200"
              }`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {["L", "M", "M", "G", "V", "S", "D"].map((d, i) => (
          <div
            key={i}
            className="text-center text-[9px] text-gray-400 font-medium pb-0.5"
          >
            {d}
          </div>
        ))}
        {Array.from({ length: 7 }, (_, i) => i + 4).map((day) => (
          <div
            key={day}
            className={`aspect-square flex items-center justify-center rounded-lg text-[10px] font-semibold ${
              day === 8
                ? "bg-vigil-orange text-white"
                : day === 6 || day === 7
                  ? "text-gray-300"
                  : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-xl bg-vigil-light-orange px-3 py-2">
        <span className="text-xs font-semibold text-vigil-orange">
          Martedì 8 — ore 10:00
        </span>
        <span className="text-[10px] bg-vigil-orange text-white rounded-full px-2 py-0.5 font-semibold">
          Disponibile
        </span>
      </div>
      <button className="w-full rounded-full bg-vigil-orange py-2 text-xs font-bold text-white">
        Conferma prenotazione
      </button>
    </div>
  </div>
);

/* ─── Mockup UI: Referral list ───────────────────────────────────── */
const ReferralMockup = () => (
  <div className="rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
      <span className="text-sm font-semibold text-gray-700">Area Referral</span>
      <span className="text-xs font-bold text-vigil-orange">Totale: €320</span>
    </div>
    <div className="p-4 space-y-2">
      {[
        {
          name: "Famiglia Russo",
          status: "Commissione maturata",
          amount: "€80",
          color: "text-green-600",
          bg: "bg-green-50",
        },
        {
          name: "Famiglia Mancini",
          status: "Attivata",
          amount: "€80",
          color: "text-consumer-blue",
          bg: "bg-consumer-light-blue",
        },
        {
          name: "Famiglia Leone",
          status: "In attesa",
          amount: "—",
          color: "text-gray-400",
          bg: "bg-gray-50",
        },
        {
          name: "Famiglia Caruso",
          status: "Commissione maturata",
          amount: "€160",
          color: "text-green-600",
          bg: "bg-green-50",
        },
      ].map((row) => (
        <div
          key={row.name}
          className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${row.bg}`}
        >
          <div>
            <div className="text-xs font-bold text-gray-900">{row.name}</div>
            <div className={`text-[10px] font-medium ${row.color}`}>
              {row.status}
            </div>
          </div>
          <span className={`text-sm font-bold ${row.color}`}>{row.amount}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Mockup UI: Link referral rapido ───────────────────────────── */
const LinkReferralMockup = () => (
  <div className="rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
      <span className="text-sm font-semibold text-gray-700">
        Link referral rapido
      </span>
    </div>
    <div className="p-5 space-y-4 text-center">
      <p className="text-xs text-gray-500 leading-relaxed">
        Condividi questo link con la famiglia. Quando si iscrive e prenota, la
        commissione viene assegnata automaticamente alla tua struttura.
      </p>
      <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 flex items-center gap-2">
        <LinkIcon className="w-4 h-4 text-gray-400 shrink-0" />
        <span className="text-xs text-gray-500 truncate flex-1 text-left">
          vigila.it/ref/centrodiagnostico-napoli
        </span>
      </div>
      <button className="w-full rounded-full bg-vigil-orange py-2.5 text-sm font-bold text-white hover:bg-vigil-orange/90 transition">
        Copia link
      </button>
    </div>
  </div>
);

/* ─── Feature block alternato ────────────────────────────────────── */
const FeatureBlock = ({
  title,
  body,
  mockup,
  reverse = false,
}: {
  title: string;
  body: string;
  mockup: React.ReactNode;
  reverse?: boolean;
}) => (
  <div
    className={`flex flex-col gap-8 md:gap-12 items-center ${
      reverse ? "md:flex-row-reverse" : "md:flex-row"
    }`}
  >
    <div className="flex-1 space-y-4">
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{body}</p>
    </div>
    <div className="flex-1 w-full">{mockup}</div>
  </div>
);

/* ─── Tabs come funziona ─────────────────────────────────────────── */
type TabKey = "booking" | "referral" | "postdimissioni";

const tabContent: {
  key: TabKey;
  label: string;
  steps: { title: string; body: string }[];
}[] = [
  {
    key: "booking",
    label: "Booking caregiver",
    steps: [
      {
        title: "Accedi al portale",
        body: "Accedi all'area clinica di Vigila con le credenziali della tua struttura.",
      },
      {
        title: "Prenota il servizio",
        body: "Seleziona il tipo di servizio (accompagnamento, assistenza post-esame), la data e l'orario. Vedi la disponibilità in tempo reale.",
      },
      {
        title: "Il caregiver arriva",
        body: "Vigila assegna il caregiver più adatto. Ricevi la conferma con i dettagli. Il paziente viene assistito da un professionista verificato.",
      },
    ],
  },
  {
    key: "referral",
    label: "Referral",
    steps: [
      {
        title: "Identifica il paziente",
        body: "Hai un paziente che ha bisogno di un caregiver a domicilio. Puoi segnalarlo con un link rapido da condividere direttamente con la famiglia, oppure dall'area referral nel portale Vigila.",
      },
      {
        title: "La famiglia si attiva",
        body: "La famiglia riceve il link, entra su Vigila e inizia il percorso per trovare un caregiver. Il sistema traccia automaticamente che la segnalazione viene da te.",
      },
      {
        title: "Guadagni la commissione",
        body: "Quando la famiglia completa il suo primo pagamento su Vigila, la commissione viene registrata nel tuo portale. Tieni traccia di tutte le segnalazioni e del loro stato.",
      },
    ],
  },
  {
    key: "postdimissioni",
    label: "Post-dimissioni",
    steps: [
      {
        title: "Segnala il caso",
        body: "Il paziente sta per essere dimesso e ha bisogno di assistenza a domicilio. Inserisci le informazioni essenziali nel portale: tipo di assistenza necessaria, zona, urgenza.",
      },
      {
        title: "Vigila trova il caregiver",
        body: "Il nostro team attiva la ricerca in modalità prioritaria. Ti aggiorniamo sullo stato in tempo reale.",
      },
      {
        title: "Assistenza garantita",
        body: "Il caregiver viene assegnato e la famiglia viene contattata direttamente da Vigila. Tu ricevi la conferma e puoi procedere con le dimissioni in sicurezza.",
      },
    ],
  },
];

const opportunities = [
  {
    icon: <CalendarDaysIcon className="w-6 h-6" />,
    title: "Prenota un caregiver per i tuoi pazienti",
    body: "Alcuni pazienti non hanno chi li accompagna alla visita o li assiste dopo un esame. Prenota direttamente dalla piattaforma un caregiver Vigila per il tempo necessario. Veloce, verificato, tracciabile.",
    tag: "Booking diretto",
    color: "bg-consumer-light-blue text-consumer-blue",
    iconBg: "bg-consumer-light-blue text-consumer-blue",
  },
  {
    icon: <ArrowPathIcon className="w-6 h-6" />,
    title: "Segnala chi ha bisogno di un caregiver",
    body: "Hai un paziente che ha bisogno di una badante? Un anziano che vive solo? Segnalalo a Vigila con un link o un codice dedicato. Quando la famiglia si attiva, guadagni una commissione.",
    tag: "Guadagni per ogni famiglia attivata",
    color: "bg-vigil-light-orange text-vigil-orange",
    iconBg: "bg-vigil-light-orange text-vigil-orange",
  },
  {
    icon: <HomeIcon className="w-6 h-6" />,
    title: "Assistenza post-dimissioni senza pensieri",
    body: "Un paziente che viene dimesso ha spesso bisogno di assistenza immediata a domicilio. Segnala il caso a Vigila: troviamo noi il caregiver giusto. Tu ti occupi della parte clinica.",
    tag: "Risposta rapida",
    color: "bg-green-50 text-green-700",
    iconBg: "bg-green-50 text-green-700",
  },
];

export default function PartnerClinichePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("booking");
  const currentTab = tabContent.find((t) => t.key === activeTab)!;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <PartnerNav
        links={[
          { label: "Come funziona", href: "#come-funziona", isAnchor: true },
          { label: "I vantaggi", href: "#vantaggi", isAnchor: true },
        ]}
        ctaLabel="Entra in lista"
        ctaHref="#form"
      />

      {/* Hero */}
      <section className="px-4 py-16 md:py-24 bg-gradient-to-b from-vigil-light-orange/40 to-white">
        <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Offri ai tuoi pazienti qualcosa che nessun altro gli dà.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Prenota un caregiver per chi non ha chi lo accompagna. Segnala chi
              ha bisogno di assistenza a domicilio. Guadagna una commissione per
              ogni famiglia che attivi.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#form"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .querySelector("#form")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center rounded-full bg-vigil-orange px-7 py-3 font-semibold text-white shadow hover:bg-vigil-orange/90 transition"
              >
                Entra in lista
              </a>
              <a
                href="#come-funziona"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .querySelector("#come-funziona")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center text-sm font-semibold text-vigil-orange hover:underline"
              >
                Scopri come funziona ↓
              </a>
            </div>
          </div>
          <div>
            <BookingMockup />
          </div>
        </div>
      </section>

      {/* Sezione 2 — Tre opportunità */}
      <section className="px-4 py-16 bg-white">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Una partnership, tre opportunità.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <div
                key={opp.title}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-6 flex flex-col gap-4"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${opp.iconBg}`}
                >
                  {opp.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {opp.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {opp.body}
                  </p>
                </div>
                <span
                  className={`mt-auto self-start rounded-full px-3 py-1 text-xs font-semibold ${opp.color}`}
                >
                  {opp.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sezione 3 — Come funziona con tabs */}
      <section
        id="come-funziona"
        className="px-4 py-16 bg-gradient-to-b from-white to-vigil-light-orange/20"
      >
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Come funziona
            </h2>
          </div>

          {/* Tabs — desktop */}
          <div className="hidden md:flex rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm mb-8">
            {tabContent.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={clsx(
                  "flex-1 py-3 text-sm font-semibold transition-colors",
                  activeTab === tab.key
                    ? "bg-vigil-orange text-white"
                    : "text-gray-600 hover:bg-gray-50",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Steps — desktop */}
          <div className="hidden md:grid grid-cols-3 gap-8">
            {currentTab.steps.map((step, i) => (
              <div
                key={step.title}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-vigil-orange text-white flex items-center justify-center text-xl font-bold shadow">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          {/* Accordion — mobile */}
          <div className="md:hidden space-y-3">
            {tabContent.map((tab) => (
              <div
                key={tab.key}
                className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm"
              >
                <button
                  onClick={() =>
                    setActiveTab(activeTab === tab.key ? "booking" : tab.key)
                  }
                  className={clsx(
                    "w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold transition",
                    activeTab === tab.key
                      ? "bg-vigil-orange text-white"
                      : "text-gray-800 hover:bg-gray-50",
                  )}
                >
                  {tab.label}
                  <span>{activeTab === tab.key ? "−" : "+"}</span>
                </button>
                {activeTab === tab.key && (
                  <div className="p-4 space-y-4">
                    {tab.steps.map((step, i) => (
                      <div key={step.title} className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-vigil-orange text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {step.title}
                          </p>
                          <p className="text-sm text-gray-600 leading-relaxed mt-1">
                            {step.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sezione 4 — Vantaggi */}
      <section id="vantaggi" className="px-4 py-16 bg-white space-y-16">
        <div className="mx-auto max-w-5xl">
          <FeatureBlock
            title="Prenota in pochi click dal tuo portale."
            body="Nessun telefono, nessuna email. Dal portale Vigila vedi la disponibilità in tempo reale, selezioni il servizio e confermi la prenotazione. Il caregiver riceve la notifica in automatico."
            mockup={<BookingMockup />}
          />
        </div>
        <div className="mx-auto max-w-5xl">
          <FeatureBlock
            title="Tieni traccia di tutte le segnalazioni e delle commissioni."
            body="Nell'area referral del portale vedi ogni segnalazione che hai fatto, lo stato (in attesa, attivata, commissione maturata) e il totale accumulato. Tutto trasparente, tutto tracciabile."
            mockup={<ReferralMockup />}
            reverse
          />
        </div>
        <div className="mx-auto max-w-5xl">
          <FeatureBlock
            title="Un servizio in più per i tuoi pazienti. Zero gestione per te."
            body="Non devi formare il personale, non devi gestire i caregiver, non devi seguire le pratiche. Vigila fa tutto. Tu offri ai tuoi pazienti qualcosa che li aiuta davvero dopo la visita."
            mockup={<LinkReferralMockup />}
          />
        </div>
      </section>

      {/* Trust badges */}
      <section className="px-4 py-8 bg-gray-50 border-y border-gray-100">
        <div className="mx-auto max-w-4xl flex flex-wrap items-center justify-center gap-6">
          {[
            {
              icon: <ShieldCheckIcon className="w-5 h-5" />,
              label: "Caregiver verificati",
            },
            {
              icon: <CurrencyEuroIcon className="w-5 h-5" />,
              label: "Commissioni tracciabili",
            },
            {
              icon: <BuildingOffice2Icon className="w-5 h-5" />,
              label: "Portale dedicato alla struttura",
            },
          ].map((b) => (
            <span
              key={b.label}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700"
            >
              <span className="text-vigil-orange">{b.icon}</span>
              {b.label}
            </span>
          ))}
        </div>
      </section>

      {/* Sezione 5 — Credenziali */}
      <PartnerCredentials />

      {/* Sezione 6 — Form */}
      <section id="form" className="px-4 py-16 bg-white">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Entra nella lista dei partner Vigila.
            </h2>
            <p className="mt-3 text-gray-600">
              Compila il form. Ti contatteremo entro 2-3 giorni lavorativi per
              una prima chiamata conoscitiva.
            </p>
          </div>
          <PartnerWaitlistFormCliniche />
        </div>
      </section>

      <PartnerFooter />
    </div>
  );
}
