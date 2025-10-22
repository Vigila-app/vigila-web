import * as React from "react";
import { EmailHeader } from "./EmailHeader";
import { EmailFooter } from "./EmailFooter";
import { AppConstants } from "@/src/constants";

interface WelcomeEmailProps {
  firstName: string;
  appUrl?: string;
}

export function WelcomeEmailTemplate({
  firstName,
  appUrl = AppConstants.hostUrl,
}: WelcomeEmailProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        margin: "0 auto",
      }}
    >
      <EmailHeader
        title="Benvenuto in Vigila!"
        subtitle="Un ponte tra generazioni"
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
          Ciao {firstName}! 👋
        </h2>
        <p
          style={{
            color: "#666",
            fontSize: "16px",
            lineHeight: "1.6",
            marginBottom: "20px",
          }}
        >
          Siamo entusiasti di averti a bordo!
          <br />
          In Vigila creiamo connessioni autentiche che arricchiscono la vita di
          giovani e anziani, costruendo una comunità più unita e solidale.
        </p>
        <p
          style={{
            color: "#666",
            fontSize: "16px",
            lineHeight: "1.6",
            marginBottom: "30px",
          }}
        >
          Con Vigila puoi:
        </p>
        <ul
          style={{
            color: "#666",
            fontSize: "16px",
            lineHeight: "1.6",
            marginBottom: "30px",
          }}
        >
          <li>Prenotare servizi di assistenza</li>
          <li>Monitorare lo stato delle tue prenotazioni</li>
          <li>Comunicare direttamente con i Vigil</li>
          <li>Gestire i pagamenti in sicurezza</li>
        </ul>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <a
            href={appUrl}
            style={{
              backgroundColor: "#007bff",
              color: "#ffffff",
              padding: "12px 30px",
              textDecoration: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            Inizia ora
          </a>
        </div>
        <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.6" }}>
          Se hai domande o hai bisogno di supporto, non esitare a contattarci.
          Siamo qui per aiutarti!
        </p>
      </div>

      <EmailFooter />
    </div>
  );
}
