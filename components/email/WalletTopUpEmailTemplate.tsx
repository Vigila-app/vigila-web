import { AppConstants } from "@/src/constants";
import * as React from "react";
import { EmailHeader } from "./EmailHeader";
import { EmailFooter } from "./EmailFooter";
import { Routes } from "@/src/routes";

interface WalletTopUpEmailProps {
  firstName: string;
  amount: string;
  currency?: string;
  appUrl?: string;
}

export function WalletTopUpEmailTemplate({
  firstName,
  amount,
  currency = "€",
  appUrl = AppConstants.hostUrl,
}: WalletTopUpEmailProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        margin: "0 auto",
      }}
    >
      <EmailHeader title="Ricarica Wallet Completata 💰" />

      <div
        style={{
          padding: "20px",
          backgroundColor: "#ffffff",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <h2 style={{ color: "#333", fontSize: "22px", marginBottom: "20px" }}>
          Ciao&nbsp;{firstName}&nbsp;🎉
        </h2>

        <p
          style={{
            color: "#666",
            fontSize: "16px",
            lineHeight: "1.6",
          }}
        >
          La tua ricarica è andata a buon fine. Il tuo wallet è stato aggiornato
          con il seguente importo:
        </p>

        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "30px",
            border: "1px solid #dee2e6",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#006fe6",
              fontSize: "36px",
              fontWeight: "bold",
              margin: "0",
            }}
          >
            {currency}
            {amount}
          </p>
          <p
            style={{
              color: "#666",
              fontSize: "14px",
              margin: "8px 0 0",
            }}
          >
            accreditati sul tuo wallet ✔️
          </p>
        </div>

        <p
          style={{
            color: "#666",
            fontSize: "16px",
            lineHeight: "1.6",
            marginBottom: "24px",
          }}
        >
          Ora puoi usare il credito per prenotare i nostri servizi di assistenza
          direttamente dall&apos;app.
        </p>

        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <a
            href={`${appUrl}${Routes.createBooking.url}`}
            style={{
              backgroundColor: "#006fe6",
              color: "#fdfdfd",
              padding: "12px 30px",
              textDecoration: "none",
              borderRadius: "32px",
              fontSize: "16px",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            Prenota ora
          </a>
        </div>

        <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6" }}>
          Per qualsiasi domanda o necessità di assistenza, contattaci tramite il
          servizio clienti.
        </p>
      </div>

      <EmailFooter />
    </div>
  );
}
