"use client";

import { useState } from "react";
import clsx from "clsx";

type FormState = "idle" | "submitting" | "success" | "error";

type CafFormData = {
  fullName: string;
  email: string;
  phone: string;
  orgName: string;
  orgType: string;
  zones: string;
  volume: string;
  services: string[];
  consent: boolean;
};

const orgTypeOptions = [
  "CAF",
  "Patronato",
  "Associazione di categoria",
  "Cooperativa sociale",
  "Altro",
];

const volumeOptions = [
  "Meno di 50",
  "50–200",
  "200–500",
  "Più di 500",
];

const serviceOptions = [
  "Assunzione e contratto CCNL",
  "Gestione buste paga",
  "Versamento contributi INPS",
  "Accesso a sussidi e bonus",
  "Consulenza lavoristica",
  "Altro",
];

const PartnerWaitlistFormCaf = () => {
  const [form, setForm] = useState<CafFormData>({
    fullName: "",
    email: "",
    phone: "",
    orgName: "",
    orgType: "",
    zones: "",
    volume: "",
    services: [],
    consent: false,
  });
  const [state, setState] = useState<FormState>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (service: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      services: checked
        ? [...prev.services, service]
        : prev.services.filter((s) => s !== service),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("submitting");
    try {
      await fetch("/api/v1/partner/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "caf", ...form }),
      });
      setState("success");
    } catch {
      setState("error");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 focus:border-consumer-blue focus:outline-none focus:ring-1 focus:ring-consumer-blue transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  if (state === "success") {
    return (
      <div className="rounded-2xl bg-consumer-light-blue border border-consumer-blue/20 p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-xl font-bold text-consumer-blue mb-2">Ricevuto.</h3>
        <p className="text-gray-600">
          Ti contatteremo entro 2–3 giorni lavorativi per una prima chiamata
          conoscitiva.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl bg-white border border-gray-200 shadow-md p-6 md:p-8"
    >
      {/* Full name */}
      <div>
        <label htmlFor="fullName" className={labelClass}>
          Il tuo nome e cognome *
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          value={form.fullName}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* Email + Phone */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email di lavoro *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Telefono *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={form.phone}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      {/* Org name */}
      <div>
        <label htmlFor="orgName" className={labelClass}>
          Nome della tua organizzazione *
        </label>
        <input
          id="orgName"
          name="orgName"
          type="text"
          required
          value={form.orgName}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* Org type */}
      <div>
        <label htmlFor="orgType" className={labelClass}>
          Che tipo di organizzazione sei? *
        </label>
        <select
          id="orgType"
          name="orgType"
          required
          value={form.orgType}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="" disabled>
            Seleziona...
          </option>
          {orgTypeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Zones */}
      <div>
        <label htmlFor="zones" className={labelClass}>
          In quali province operate?
        </label>
        <input
          id="zones"
          name="zones"
          type="text"
          placeholder="Es. Napoli, Roma, Milano..."
          value={form.zones}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* Volume */}
      <fieldset>
        <legend className={clsx(labelClass, "mb-2")}>
          Quante famiglie con caregiver seguite oggi? *
        </legend>
        <div className="flex flex-col gap-2">
          {volumeOptions.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"
            >
              <input
                type="radio"
                name="volume"
                value={opt}
                required
                checked={form.volume === opt}
                onChange={handleChange}
                className="accent-consumer-blue"
              />
              {opt}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Services */}
      <fieldset>
        <legend className={clsx(labelClass, "mb-2")}>
          Quali servizi offrite?
        </legend>
        <div className="flex flex-col gap-2">
          {serviceOptions.map((svc) => (
            <label
              key={svc}
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={form.services.includes(svc)}
                onChange={(e) => handleCheckbox(svc, e.target.checked)}
                className="accent-consumer-blue"
              />
              {svc}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Consent */}
      <label className="flex items-start gap-2 cursor-pointer text-sm text-gray-600">
        <input
          type="checkbox"
          required
          checked={form.consent}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, consent: e.target.checked }))
          }
          className="mt-0.5 accent-consumer-blue shrink-0"
        />
        <span>
          Acconsento al trattamento dei dati personali per essere contattato da
          Vigila. *
        </span>
      </label>

      {state === "error" && (
        <p className="text-sm text-red-600">
          Si è verificato un errore. Riprova tra qualche istante.
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className={clsx(
          "w-full rounded-full py-3 px-6 font-semibold text-white shadow transition",
          state === "submitting"
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-consumer-blue hover:bg-consumer-blue/90"
        )}
      >
        {state === "submitting" ? "Invio in corso..." : "Entra in lista"}
      </button>
    </form>
  );
};

export default PartnerWaitlistFormCaf;
