"use client";

import {
  DocumentTextIcon,
  BellAlertIcon,
  ArrowUpTrayIcon,
  UserGroupIcon,
  MegaphoneIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import PartnerNav from "@/components/partner/PartnerNav";
import PartnerFooter from "@/components/partner/PartnerFooter";
import PartnerCredentials from "@/components/partner/PartnerCredentials";
import PartnerWaitlistFormCaf from "@/components/partner/PartnerWaitlistFormCaf";

/* ─── Mockup UI: Dashboard partner ────────────────────────────────── */
const DashboardMockup = () => (
  <div className="rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
    <div className="bg-consumer-blue px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-white/40" />
        <span className="text-white text-xs font-semibold">
          Dashboard Partner
        </span>
      </div>
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-white/30" />
        <div className="w-2 h-2 rounded-full bg-white/30" />
        <div className="w-2 h-2 rounded-full bg-white/30" />
      </div>
    </div>
    <div className="p-4 space-y-3">
      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Famiglie attive", value: "34" },
          { label: "Buste paga", value: "12" },
          { label: "Nuove pratiche", value: "5" },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-xl bg-consumer-light-blue p-3 text-center"
          >
            <div className="text-xl font-bold text-consumer-blue">{m.value}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>
      {/* Da fare oggi */}
      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Da fare oggi
        </div>
        {[
          { name: "Famiglia Rossi", task: "Busta paga ottobre", badge: "🔴" },
          {
            name: "Famiglia Bianchi",
            task: "Nuova pratica da aprire",
            badge: "🟡",
          },
          {
            name: "Famiglia Verdi",
            task: "Conferma ore novembre",
            badge: "🟢",
          },
        ].map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
          >
            <div>
              <div className="text-xs font-semibold text-gray-800">
                {item.name}
              </div>
              <div className="text-[11px] text-gray-500">{item.task}</div>
            </div>
            <span className="text-base">{item.badge}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Mockup UI: Nuove pratiche ───────────────────────────────────── */
const PraticheMockup = () => (
  <div className="rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
      <span className="text-sm font-semibold text-gray-700">
        Nuove pratiche da aprire
      </span>
    </div>
    <div className="p-4 space-y-3">
      {[
        {
          family: "Famiglia Esposito",
          caregiver: "Maria R.",
          contract: "Part-time CCNL",
          hours: "20h/sett.",
        },
        {
          family: "Famiglia Ferrara",
          caregiver: "Anna L.",
          contract: "Full-time CCNL",
          hours: "40h/sett.",
        },
        {
          family: "Famiglia Conte",
          caregiver: "Sara M.",
          contract: "Part-time CCNL",
          hours: "25h/sett.",
        },
      ].map((p) => (
        <div
          key={p.family}
          className="rounded-xl border border-gray-100 bg-gray-50 p-3"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-gray-900">{p.family}</span>
            <span className="text-[10px] bg-consumer-light-blue text-consumer-blue rounded-full px-2 py-0.5 font-semibold">
              Nuova
            </span>
          </div>
          <div className="text-[11px] text-gray-500">
            Caregiver: {p.caregiver} · {p.contract} · {p.hours}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Mockup UI: Archivio documenti ──────────────────────────────── */
const DocumentiMockup = () => (
  <div className="rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
      <span className="text-sm font-semibold text-gray-700">
        Archivio documenti — Famiglia Rossi
      </span>
    </div>
    <div className="p-4 space-y-2">
      {[
        { month: "Ottobre 2025", status: "Nuovo", highlight: true },
        { month: "Settembre 2025", status: "Consegnato", highlight: false },
        { month: "Agosto 2025", status: "Consegnato", highlight: false },
        { month: "Luglio 2025", status: "Consegnato", highlight: false },
      ].map((doc) => (
        <div
          key={doc.month}
          className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${
            doc.highlight ? "bg-consumer-light-blue" : "bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-2">
            <DocumentTextIcon className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-800">
              Busta paga {doc.month}
            </span>
          </div>
          <span
            className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${
              doc.highlight
                ? "bg-consumer-blue text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {doc.status}
          </span>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Mockup UI: Vista payroll mensile ───────────────────────────── */
const PayrollMockup = () => (
  <div className="rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
      <span className="text-sm font-semibold text-gray-700">
        Payroll — Novembre 2025
      </span>
    </div>
    <div className="p-4 space-y-2">
      {[
        {
          family: "Famiglia Rossi",
          hours: "88h — Nessuna variazione",
          state: "Confermato",
          color: "text-green-600",
        },
        {
          family: "Famiglia Bianchi",
          hours: "72h — 3h in meno (malattia)",
          state: "Variazione",
          color: "text-amber-600",
        },
        {
          family: "Famiglia Verdi",
          hours: "In attesa di conferma",
          state: "In attesa",
          color: "text-gray-400",
        },
      ].map((row) => (
        <div
          key={row.family}
          className="rounded-xl border border-gray-100 bg-gray-50 p-3"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-gray-900">{row.family}</span>
            <span className={`text-[10px] font-semibold ${row.color}`}>
              {row.state}
            </span>
          </div>
          <div className="text-[11px] text-gray-500">{row.hours}</div>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Mockup UI: Cobrand header ──────────────────────────────────── */
const CobrandMockup = () => (
  <div className="rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
    <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-24 h-6 rounded bg-consumer-blue/20 flex items-center justify-center">
          <span className="text-[9px] font-bold text-consumer-blue">
            CAF ESEMPIO
          </span>
        </div>
        <span className="text-gray-300 text-xs">·</span>
        <div className="w-14 h-4 rounded bg-gray-100 flex items-center justify-center">
          <span className="text-[8px] font-bold text-gray-500">VIGILA</span>
        </div>
      </div>
      <span className="text-[10px] text-gray-400 font-medium">
        Area Partner
      </span>
    </div>
    <div className="p-4 space-y-2">
      <div className="text-xs font-semibold text-gray-700 mb-3">
        CAF Esempio — Area Partner
      </div>
      {[
        { label: "Nuove pratiche", count: 3, color: "bg-consumer-light-blue text-consumer-blue" },
        { label: "Buste paga da caricare", count: 7, color: "bg-vigil-light-orange text-vigil-orange" },
        { label: "Famiglie attive", count: 34, color: "bg-green-50 text-green-700" },
      ].map((row) => (
        <div
          key={row.label}
          className={`flex items-center justify-between rounded-xl px-3 py-2 ${row.color}`}
        >
          <span className="text-[11px] font-medium">{row.label}</span>
          <span className="text-sm font-bold">{row.count}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Feature block alternato ────────────────────────────────────── */
const FeatureBlock = ({
  title,
  body,
  tag,
  microcopy,
  mockup,
  reverse = false,
}: {
  title: string;
  body: string;
  tag?: string;
  microcopy?: string;
  mockup: React.ReactNode;
  reverse?: boolean;
}) => (
  <div
    className={`flex flex-col gap-8 md:gap-12 items-center ${
      reverse ? "md:flex-row-reverse" : "md:flex-row"
    }`}
  >
    <div className="flex-1 space-y-4">
      {tag && (
        <span className="inline-block rounded-full bg-consumer-light-blue px-3 py-1 text-xs font-semibold text-consumer-blue">
          {tag}
        </span>
      )}
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{body}</p>
      {microcopy && (
        <p className="text-sm font-semibold text-consumer-blue">{microcopy}</p>
      )}
    </div>
    <div className="flex-1 w-full">{mockup}</div>
  </div>
);

/* ─── Sezione Problema ───────────────────────────────────────────── */
const problems = [
  {
    title: "Acquisizione costosa",
    body: "Raggiungere famiglie che hanno bisogno di regolarizzare una badante richiede campagne, eventi, passaparola. Il costo è alto e i risultati incerti.",
    icon: <ChartBarIcon className="w-5 h-5" />,
  },
  {
    title: "Famiglie non preparate",
    body: "Spesso le famiglie arrivano da te senza aver ancora scelto il caregiver, senza sapere cosa vogliono e senza urgenza. La pratica si arena.",
    icon: <UserGroupIcon className="w-5 h-5" />,
  },
  {
    title: "Un mercato enorme ancora irregolare",
    body: "In Italia il 50-60% delle collaboratrici domestiche lavora in nero. Ogni famiglia che regolarizza è un cliente potenziale che oggi non riesci a intercettare.",
    icon: <MegaphoneIcon className="w-5 h-5" />,
  },
];

/* ─── Steps ─────────────────────────────────────────────────────── */
const steps = [
  {
    num: 1,
    title: "La famiglia trova il caregiver",
    body: "La famiglia usa Vigila per trovare un caregiver verificato. Alla fine del percorso, Vigila propone il servizio di regolarizzazione del rapporto di lavoro.",
    icon: <UserGroupIcon className="w-6 h-6" />,
  },
  {
    num: 2,
    title: "Vigila ti passa la pratica",
    body: "Ricevi una notifica con tutti i dati già raccolti e strutturati: famiglia, caregiver, tipo di contratto, ore, compenso. Apri la pratica con i tuoi strumenti come fai sempre.",
    icon: <BellAlertIcon className="w-6 h-6" />,
  },
  {
    num: 3,
    title: "Tu gestisci, Vigila distribuisce",
    body: "Carichi i documenti prodotti sulla piattaforma Vigila. La famiglia li trova nel suo profilo. Il caregiver li trova nel suo. Per loro sembra tutto in un posto solo.",
    icon: <ArrowUpTrayIcon className="w-6 h-6" />,
  },
];

export default function PartnerCafPage() {
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
      <section className="px-4 py-16 md:py-24 bg-gradient-to-b from-consumer-light-blue/40 to-white">
        <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Le famiglie che cerchi sono già su Vigila.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Ogni giorno famiglie con anziani a domicilio trovano il loro
              caregiver su Vigila e hanno bisogno di qualcuno che gestisca
              contratto, buste paga e contributi. Diventa partner e raggiungi
              questi clienti senza fare acquisizione.
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
                className="inline-flex items-center justify-center rounded-full bg-consumer-blue px-7 py-3 font-semibold text-white shadow hover:bg-consumer-blue/90 transition"
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
                className="inline-flex items-center justify-center text-sm font-semibold text-consumer-blue hover:underline"
              >
                Scopri come funziona ↓
              </a>
            </div>
          </div>
          <div>
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* Sezione 2 — Problema */}
      <section className="px-4 py-16 bg-white">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Trovare nuovi clienti è difficile. Servirli bene è la tua forza.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-6 space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-consumer-light-blue flex items-center justify-center text-consumer-blue">
                  {p.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {p.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sezione 3 — Come funziona */}
      <section
        id="come-funziona"
        className="px-4 py-16 bg-gradient-to-b from-white to-consumer-light-blue/20"
      >
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Vigila porta le famiglie. Tu porti la competenza.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-consumer-blue text-white flex items-center justify-center shadow-lg">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-vigil-orange text-white text-xs font-bold flex items-center justify-center">
                    {step.num}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sezione 4 — Vantaggi */}
      <section id="vantaggi" className="px-4 py-16 bg-white space-y-16">
        <div className="mx-auto max-w-5xl">
          <FeatureBlock
            title="Clienti già motivati. Zero convincimento."
            body="Le famiglie che arrivano da te tramite Vigila hanno già scelto il caregiver e già capito di aver bisogno di regolarizzare. Non devi spiegare perché è importante farlo — devi solo aprire la pratica."
            tag="Nessun costo di acquisizione"
            mockup={<PraticheMockup />}
          />
        </div>
        <div className="mx-auto max-w-5xl">
          <FeatureBlock
            title="Una dashboard pensata per chi gestisce tante famiglie."
            body="Vedi tutte le pratiche in un colpo d'occhio. Sai esattamente cosa fare oggi: quali buste paga caricare, quali nuove pratiche aprire. Badge di priorità per non perdere mai una scadenza."
            microcopy="Lavori con i tuoi strumenti. Vigila ti dà la struttura."
            mockup={<DashboardMockup />}
            reverse
          />
        </div>
        <div className="mx-auto max-w-5xl">
          <FeatureBlock
            title="La tua identità resta al centro."
            body="Il portale che le famiglie vedono porta il tuo nome e il tuo logo. Vigila lavora in cobrand: l'infrastruttura è nostra, la relazione con il cliente è tua. Le famiglie ti scelgono — Vigila ti supporta."
            microcopy="Nessuna sovrapposizione di brand. Nessuna concorrenza sulla relazione."
            mockup={<CobrandMockup />}
          />
        </div>
        <div className="mx-auto max-w-5xl">
          <FeatureBlock
            title="I documenti arrivano alle famiglie in automatico."
            body="Carichi la busta paga una volta. La famiglia riceve una notifica e la trova nel suo profilo. Il caregiver la trova nel suo. Nessuno ti chiama per sapere dove sono i documenti."
            mockup={<DocumentiMockup />}
            reverse
          />
        </div>
        <div className="mx-auto max-w-5xl">
          <FeatureBlock
            title="La famiglia conferma le ore ogni mese. Tu ricevi tutto già pronto."
            body="A inizio mese Vigila chiede alla famiglia di confermare le ore lavorate o segnalare variazioni. Ricevi le informazioni già strutturate prima di produrre la busta paga. Meno telefonate, meno errori."
            mockup={<PayrollMockup />}
          />
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
          <PartnerWaitlistFormCaf />
        </div>
      </section>

      <PartnerFooter />
    </div>
  );
}
