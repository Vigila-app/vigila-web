import * as React from "react";
import { EmailHeader } from "./EmailHeader";
import { EmailFooter } from "./EmailFooter";
import { AppConstants } from "@/src/constants";

interface NoticeBoardProposalEmailProps {
  recipientName: string;
  vigilName: string;
  serviceLabel: string;
  zone: string;
  registrationUrl: string;
  appUrl?: string;
}

export function NoticeBoardProposalEmailTemplate({
  recipientName,
  vigilName,
  serviceLabel,
  zone,
  registrationUrl,
  appUrl = AppConstants.hostUrl,
}: NoticeBoardProposalEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "0 auto" }}>
      <EmailHeader
        title="Un Vigil è disponibile per te! 🎉"
        subtitle="Completa la tua prenotazione su Vigila"
      />

      <div
        style={{
          padding: "20px",
          backgroundColor: "#ffffff",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <h2 style={{ color: "#333", fontSize: "22px", marginBottom: "20px" }}>
          Ciao {recipientName}! 👋
        </h2>

        <p
          style={{
            color: "#666",
            fontSize: "16px",
            lineHeight: "1.6",
            marginBottom: "20px",
          }}
        >
          Buone notizie! <strong>{vigilName}</strong> è disponibile ad aiutarti
          con il servizio <strong>{serviceLabel}</strong> nella tua zona (
          {zone}).
        </p>

        <p
          style={{
            color: "#666",
            fontSize: "16px",
            lineHeight: "1.6",
            marginBottom: "20px",
          }}
        >
          Per completare la prenotazione, registrati gratuitamente su Vigila e
          conferma il servizio direttamente in app. Una volta registrato, potrai:
        </p>

        <ul
          style={{
            color: "#666",
            fontSize: "16px",
            lineHeight: "1.6",
            marginBottom: "30px",
          }}
        >
          <li>Rivedere i dettagli del servizio</li>
          <li>Scegliere data e orario</li>
          <li>Pagare in modo sicuro tramite il portafoglio digitale Vigila</li>
        </ul>

        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <a
            href={registrationUrl}
            style={{
              backgroundColor: "#E87722",
              color: "#ffffff",
              padding: "12px 30px",
              textDecoration: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            Registrati e completa la prenotazione
          </a>
        </div>

        <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.6" }}>
          Hai già un account?{" "}
          <a href={appUrl} style={{ color: "#E87722" }}>
            Accedi direttamente
          </a>{" "}
          per visualizzare la proposta.
        </p>
      </div>

      <EmailFooter />
    </div>
  );
}

export default NoticeBoardProposalEmailTemplate;
