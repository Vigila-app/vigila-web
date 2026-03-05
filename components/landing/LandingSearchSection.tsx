"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { AddressI } from "@/src/types/maps.types";
import { PublicSearchService } from "@/src/services/notice-board.service";
import { ServiceCatalogTypeEnum } from "@/src/enums/services.enums";
import { ServicesService } from "@/src/services/services.service";
import { Routes } from "@/src/routes";
import useAltcha from "@/src/hooks/useAltcha";
import { Section } from "./Section";
import { Input, Select, TextArea, Checkbox } from "@/components/form";
import { Button, ButtonLink } from "@/components";
import { RolesEnum } from "@/src/enums/roles.enums";
import { AltchaService } from "@/src/services/altcha.service";

const SearchAddress = dynamic(
  () => import("@/components/maps/searchAddress.component"),
  { ssr: false },
);

const Altcha = dynamic(() => import("@/components/@core/altcha/altcha"), {
  ssr: false,
});

type SearchState = "idle" | "loading" | "found" | "not_found" | "error";

// Derive service options from the central ServiceCatalog via ServicesService
const serviceOptions = ServicesService.getServicesCatalog().map((s) => ({
  label: s.name,
  value: s.type,
}));

const LandingSearchSection = () => {
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [foundServices, setFoundServices] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressI | null>(null);
  const { challenge, onStateChange, isVerified } = useAltcha();

  const handleAddressSelect = async (address: AddressI) => {
    setSelectedAddress(address);
  };

  const doSearch = async () => {
    try {
      setSearchState("loading");
      if (challenge) {
        await AltchaService.verifyChallenge(challenge);
        const postalCode =
          selectedAddress?.address?.postcode || selectedAddress?.q || "";
        const city =
          selectedAddress?.address?.town ||
          selectedAddress?.address?.county ||
          selectedAddress?.city ||
          selectedAddress?.display_name?.split(",")[0] ||
          "";

        const result = await PublicSearchService.searchServices({
          postalCode,
          city,
          lat:
            selectedAddress?.lat !== undefined
              ? Number(selectedAddress.lat)
              : undefined,
          lon:
            selectedAddress?.lon !== undefined
              ? Number(selectedAddress.lon)
              : undefined,
        });

        const resultData = result as any;
        if (resultData?.data?.found) {
          setFoundServices(resultData.data.services || []);
          setSearchState("found");
        } else {
          setFoundServices([]);
          setSearchState("not_found");
        }
      } else {
        throw new Error("Captcha challenge not available");
      }
    } catch (err) {
      console.error("Error in search:", err);
      setSearchState("error");
    }
  };

  useEffect(() => {
    if (isVerified) {
      doSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVerified]);

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
          Cerca servizi disponibili&nbsp;
          <span className="text-consumer-blue">nella tua zona</span>
        </>
      }
      subtitle="Inserisci il tuo CAP o comune per scoprire i servizi Vigila disponibili vicino a te."
    >
      <div className="w-full max-w-xl mx-auto">
        {showSearchInput ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
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
            <Button
              type="submit"
              label={searchState === "loading" ? "Ricerca in corso…" : "Cerca"}
              role={RolesEnum.CONSUMER}
              full
              isLoading={searchState === "loading"}
              disabled={!selectedAddress}
            />
            <Altcha floating onStateChange={onStateChange} />
            {searchState === "error" && (
              <div className="flex items-center gap-2 text-red-500 text-sm py-2">
                <ExclamationCircleIcon className="size-5" />
                <span>Si è verificato un errore. Riprova.</span>
              </div>
            )}
          </form>
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
              <Button
                secondary
                full
                label="Nuova ricerca"
                action={resetSearch}
              />
              <ButtonLink
                label="Registrati e prenota"
                role={RolesEnum.CONSUMER}
                full
                href={Routes.registrationConsumer.url}
              />
            </div>
          </div>
        ) : searchState === "not_found" ? (
          <NotFoundSection
            address={selectedAddress}
            onReset={resetSearch}
          />
        ) : null}
      </div>
    </Section>
  );
};

const NotFoundSection = ({
  address,
  onReset,
}: {
  address: AddressI | null;
  onReset: () => void;
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

  const postalCode = address?.address?.postcode || address?.q || "";
  const city =
    address?.address?.town ||
    address?.address?.county ||
    address?.city ||
    address?.display_name?.split(",")[0] ||
    "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
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
        <Button label="Nuova ricerca" secondary full action={onReset} />
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
          <Button label="Nuova ricerca" secondary full action={onReset} />
          <Button
            label="Pubblica annuncio"
            role={RolesEnum.CONSUMER}
            full
            action={() => setShowForm(true)}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Select
            label="Tipo di servizio"
            required
            options={serviceOptions}
            value={form.service_type}
            onChange={(value) =>
              setForm((f) => ({ ...f, service_type: value }))
            }
            placeholder="Seleziona il servizio…"
            role={RolesEnum.CONSUMER}
          />
          <Input
            label="Nome"
            type="text"
            required
            value={form.name}
            onChange={(value) =>
              setForm((f) => ({ ...f, name: value as string }))
            }
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
            onChange={(checked) =>
              setForm((f) => ({ ...f, consent: checked as boolean }))
            }
            role={RolesEnum.CONSUMER}
          />
          <div className="flex gap-3">
            <Button
              type="button"
              label="Annulla"
              secondary
              full
              action={() => setShowForm(false)}
            />
            <Button
              type="submit"
              label={isLoading ? "Pubblicazione…" : "Pubblica annuncio"}
              role={RolesEnum.CONSUMER}
              isLoading={isLoading}
              full
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default LandingSearchSection;
