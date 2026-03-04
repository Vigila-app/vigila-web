"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { AddressI } from "@/src/types/maps.types";
import { PublicSearchService } from "@/src/services/notice-board.service";
import { ServiceCatalogTypeEnum } from "@/src/enums/services.enums";
import { Routes } from "@/src/routes";
import useAltcha from "@/src/hooks/useAltcha";
import { Section } from "./Section";
import { Input, Select, TextArea, Checkbox } from "@/components/form";
import Button from "@/components/button/button";
import { RolesEnum } from "@/src/enums/roles.enums";
import servicesCatalogJson from "@/mock/cms/services-catalog.json";

const SearchAddress = dynamic(
  () => import("@/components/maps/searchAddress.component"),
  { ssr: false }
);

const Altcha = dynamic(() => import("@/components/@core/altcha/altcha"), {
  ssr: false,
});

type SearchState = "idle" | "loading" | "found" | "not_found" | "error";

// Derive service options from the central ServiceCatalog (filtered to valid enum values)
const VALID_SERVICE_TYPES = Object.values(ServiceCatalogTypeEnum) as string[];
const serviceOptions = servicesCatalogJson.services_catalog
  .filter((s) => VALID_SERVICE_TYPES.includes(s.type))
  .map((s) => ({ label: s.name, value: s.type }));

const LandingSearchSection = () => {
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [foundServices, setFoundServices] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressI | null>(null);
  const { challenge, isVerified, onStateChange } = useAltcha();
  const altchaRef = useRef<{ value: string | null }>(null);

  const handleAddressSelect = async (address: AddressI) => {
    setSelectedAddress(address);
    const captcha = altchaRef.current?.value || challenge;
    if (!captcha) {
      return;
    }
    await doSearch(address, captcha);
  };

  const doSearch = async (address: AddressI, captcha: string) => {
    try {
      setSearchState("loading");
      const postalCode = address.address?.postcode || address.q || "";
      const city =
        address.address?.town ||
        address.address?.county ||
        address.city ||
        address.display_name?.split(",")[0] ||
        "";

      const result = await PublicSearchService.searchServices({
        captcha,
        postalCode,
        city,
        lat: address.lat !== undefined ? Number(address.lat) : undefined,
        lon: address.lon !== undefined ? Number(address.lon) : undefined,
      });

      const resultData = result as any;
      if (resultData?.data?.found) {
        setFoundServices(resultData.data.services || []);
        setSearchState("found");
      } else {
        setFoundServices([]);
        setSearchState("not_found");
      }
    } catch {
      setSearchState("error");
    }
  };

  const handleAltchaStateChange = (evt: CustomEvent) => {
    onStateChange(evt);
    if (evt.detail?.state === "verified" && selectedAddress) {
      doSearch(selectedAddress, evt.detail.payload);
    }
  };

  const resetSearch = () => {
    setSearchState("idle");
    setFoundServices([]);
    setSelectedAddress(null);
  };

  const showSearchInput = ["idle", "loading", "error"].includes(searchState);

  return (
    <Section
      id="cerca-servizi"
      variant="gradient-light-blue"
      label="Verifica disponibilità"
      title={
        <>
          Cerca servizi disponibili{" "}
          <span className="text-consumer-blue">nella tua zona</span>
        </>
      }
      subtitle="Inserisci il tuo CAP o comune per scoprire i servizi Vigila disponibili vicino a te."
    >
      <div className="w-full max-w-xl mx-auto">
        {showSearchInput ? (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
              <SearchAddress
                onSubmit={handleAddressSelect}
                placeholder="Inserisci CAP o comune"
                label="La tua zona"
                autoFocus={false}
                debounce={800}
                addressTypes={["postcode", "city", "town", "village"]}
                resetOnSubmit={false}
              />
            </div>
            <div className="flex justify-center">
              <Altcha
                ref={altchaRef}
                onStateChange={handleAltchaStateChange}
              />
            </div>
            {searchState === "loading" && (
              <div className="flex items-center justify-center gap-2 text-consumer-blue text-sm py-2">
                <MagnifyingGlassIcon className="size-5 animate-pulse" />
                <span>Ricerca in corso…</span>
              </div>
            )}
            {searchState === "error" && (
              <div className="flex items-center gap-2 text-red-500 text-sm py-2">
                <ExclamationCircleIcon className="size-5" />
                <span>Si è verificato un errore. Riprova.</span>
              </div>
            )}
          </div>
        ) : searchState === "found" ? (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-green-100 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircleIcon className="size-6 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">
                  Ottima notizia! Ci sono servizi disponibili nella tua zona.
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Registrati per prenotare subito il tuo primo servizio.
                </p>
              </div>
            </div>
            <ul className="flex flex-wrap gap-2">
              {foundServices.map((service) => (
                <li
                  key={service}
                  className="bg-consumer-light-blue/30 text-consumer-blue text-sm font-medium px-3 py-1 rounded-full"
                >
                  {service}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={Routes.registrationConsumer.url}
                className="flex-1 text-center bg-consumer-blue hover:bg-consumer-blue/90 text-white font-semibold py-2.5 px-5 rounded-xl transition"
              >
                Registrati e prenota
              </Link>
              <button
                onClick={resetSearch}
                className="flex-1 text-center border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium py-2.5 px-5 rounded-xl transition text-sm"
              >
                Nuova ricerca
              </button>
            </div>
          </div>
        ) : searchState === "not_found" ? (
          <NotFoundSection
            address={selectedAddress}
            onReset={resetSearch}
            captcha={challenge}
          />
        ) : null}
      </div>
    </Section>
  );
};

const NotFoundSection = ({
  address,
  onReset,
  captcha,
}: {
  address: AddressI | null;
  onReset: () => void;
  captcha: string;
}) => {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    service_type: "" as string,
    consent: false,
  });
  const noticeBoardAltchaRef = useRef<{ value: string | null }>(null);
  const { challenge: noticeCaptcha, onStateChange: onNoticeAltchaChange } =
    useAltcha();

  const postalCode = address?.address?.postcode || address?.q || "";
  const city =
    address?.address?.town ||
    address?.address?.county ||
    address?.city ||
    address?.display_name?.split(",")[0] ||
    "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const usedCaptcha =
      noticeBoardAltchaRef.current?.value || noticeCaptcha || captcha;
    if (
      !usedCaptcha ||
      !form.name ||
      !form.email ||
      !form.service_type ||
      !postalCode ||
      !form.consent
    )
      return;
    try {
      setIsLoading(true);
      const { NoticeBoardService } = await import(
        "@/src/services/notice-board.service"
      );
      await NoticeBoardService.createNotice({
        captcha: usedCaptcha,
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        message: form.message || undefined,
        postal_code: postalCode,
        city: city || undefined,
        service_type: form.service_type as ServiceCatalogTypeEnum,
      });
      setSubmitted(true);
    } catch {
      setIsLoading(false);
      alert("Si è verificato un errore nell'invio dell'annuncio. Riprova.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-consumer-light-blue space-y-3">
        <div className="flex items-start gap-3">
          <CheckCircleIcon className="size-6 text-consumer-blue shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-800">
              Annuncio pubblicato con successo!
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Un Vigil della tua zona ti contatterà non appena disponibile per
              offrirti il servizio.
            </p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="text-consumer-blue text-sm underline underline-offset-2"
        >
          Fai un&apos;altra ricerca
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-orange-100 space-y-4">
      <div className="flex items-start gap-3">
        <ExclamationCircleIcon className="size-6 text-vigil-orange shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-gray-800">
            Nessun Vigil ancora disponibile nella tua zona.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Pubblica un annuncio sulla bacheca Vigila: un assistente disponibile
            ti contatterà non appena sarà nella tua zona.
          </p>
        </div>
      </div>
      {!showForm ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            label="Pubblica annuncio"
            role={RolesEnum.CONSUMER}
            full
            action={() => setShowForm(true)}
          />
          <Button
            label="Nuova ricerca"
            secondary
            full
            action={onReset}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Select
            label="Tipo di servizio"
            required
            options={serviceOptions}
            value={form.service_type}
            onChange={(value) => setForm((f) => ({ ...f, service_type: value }))}
            placeholder="Seleziona il servizio…"
            role={RolesEnum.CONSUMER}
          />
          <Input
            label="Nome"
            type="text"
            required
            value={form.name}
            onChange={(value) => setForm((f) => ({ ...f, name: value as string }))}
            placeholder="Il tuo nome"
            role={RolesEnum.CONSUMER}
          />
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(value) =>
              setForm((f) => ({ ...f, email: value as string }))
            }
            placeholder="La tua email"
            role={RolesEnum.CONSUMER}
          />
          <Input
            label="Telefono"
            type="tel"
            value={form.phone}
            onChange={(value) =>
              setForm((f) => ({ ...f, phone: value as string }))
            }
            placeholder="Il tuo numero di telefono (opzionale)"
            role={RolesEnum.CONSUMER}
          />
          <TextArea
            label="Messaggio"
            value={form.message}
            onChange={(e) =>
              setForm((f) => ({ ...f, message: e.target.value }))
            }
            rows={3}
            placeholder="Descrivi il servizio di cui hai bisogno… (opzionale)"
            role={RolesEnum.CONSUMER}
          />
          <Checkbox
            label="Autorizzo Vigila a utilizzare i miei contatti per mettermi in relazione con un assistente disponibile nella mia zona."
            required
            checked={form.consent}
            onChange={(checked) => setForm((f) => ({ ...f, consent: checked as boolean }))}
            role={RolesEnum.CONSUMER}
          />
          <div className="flex justify-center">
            <Altcha
              ref={noticeBoardAltchaRef}
              onStateChange={onNoticeAltchaChange}
            />
          </div>
          <div className="flex gap-3">
            <Button
              type="submit"
              label={isLoading ? "Invio…" : "Pubblica annuncio"}
              role={RolesEnum.CONSUMER}
              isLoading={isLoading}
              full
            />
            <Button
              type="button"
              label="Annulla"
              secondary
              full
              action={() => setShowForm(false)}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default LandingSearchSection;
