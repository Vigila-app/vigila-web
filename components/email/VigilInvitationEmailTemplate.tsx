import * as React from "react";
import { EmailHeader } from "./EmailHeader";
import { EmailFooter } from "./EmailFooter";
import { AppConstants } from "@/src/constants";

interface VigilInvitationEmailTemplateProps {
  nome: string;
  cognome: string;
  activationLink: string;
  appUrl?: string;
}

export function VigilInvitationEmailTemplate({
  nome,
  cognome,
  activationLink,
  appUrl = AppConstants.hostUrl,
}: VigilInvitationEmailTemplateProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        margin: "0 auto",
      }}
    >
      <EmailHeader
        title="Sei stato/a selezionato/a come Vigil! 🧡"
        subtitle="Completa la registrazione e inizia a fare la differenza nella tua comunità."
      />

      <div
        style={{
          padding: "20px",
          backgroundColor: "#ffffff",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{ color: "#333", fontSize: "22px", marginBottom: "20px" }}
        >
          Ciao&nbsp;{nome}&nbsp;{cognome}!&nbsp;👋
        </h2>

        <p
          style={{
            color: "#666",
            fontSize: "16px",
            lineHeight: "1.6",
            marginBottom: "20px",
          }}
        >
          Siamo felici di averti selezionato/a come Vigil nella nostra
          piattaforma Vigila. Il tuo profilo è stato inserito nel nostro
          sistema e non dovrai ricominciare da zero!
        </p>

        <p
          style={{
            color: "#666",
            fontSize: "16px",
            lineHeight: "1.6",
            marginBottom: "20px",
          }}
        >
          Per attivare il tuo account e iniziare a ricevere richieste,
          clicca sul pulsante qui sotto:
        </p>

        <div
          style={{
            textAlign: "center",
            margin: "30px 0",
          }}
        >
          <a
            href={activationLink}
            style={{
              backgroundColor: "#f97316",
              color: "#ffffff",
              padding: "14px 32px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            Attiva il tuo profilo Vigil ✅
          </a>
        </div>

        <p
          style={{
            color: "#666",
            fontSize: "14px",
            lineHeight: "1.6",
            marginBottom: "20px",
          }}
        >
          Il link è valido per 24 ore. Se non riesci a cliccare sul pulsante,
          copia e incolla questo indirizzo nel tuo browser:
        </p>

        <p
          style={{
            color: "#0066cc",
            fontSize: "13px",
            wordBreak: "break-all",
            marginBottom: "20px",
          }}
        >
          {activationLink}
        </p>

        <div
          style={{
            backgroundColor: "#fff7ed",
            padding: "15px",
            borderRadius: "6px",
            borderLeft: "4px solid #f97316",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              color: "#c2410c",
              fontSize: "14px",
              margin: "0",
              fontWeight: "bold",
            }}
          >
            💡 Cosa fare dopo l&apos;attivazione:
          </p>
          <ul
            style={{
              color: "#c2410c",
              fontSize: "14px",
              margin: "10px 0 0 0",
              paddingLeft: "20px",
            }}
          >
            <li>Imposta la tua password</li>
            <li>Verifica e completa il tuo profilo</li>
            <li>Configura la tua disponibilità e le zone di copertura</li>
            <li>Aggiungi i servizi che offri</li>
          </ul>
        </div>

        <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.6" }}>
          Se hai domande o hai bisogno di supporto, non esitare a contattarci
          rispondendo a questa email. Siamo qui per aiutarti!
        </p>

        <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.6" }}>
          Il team Vigila 🧡
        </p>
      </div>

      <EmailFooter />
    </div>
  );
}
