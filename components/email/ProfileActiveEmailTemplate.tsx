import * as React from "react";
import { EmailHeader } from "./EmailHeader";
import { EmailFooter } from "./EmailFooter";
import { AppConstants } from "@/src/constants";
import { UserDetailsType } from "@/src/types/user.types";
import { RolesEnum } from "@/src/enums/roles.enums";
import { Routes } from "@/src/routes";

interface ProfileActiveEmailTemplateProps {
  user: UserDetailsType;
  appUrl?: string;
}

export function ProfileActiveEmailTemplate({
  user,
  appUrl = AppConstants.hostUrl,
}: ProfileActiveEmailTemplateProps) {
  const { user_metadata } = user;
  const { name, role } = user_metadata || {};
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <EmailHeader
        title="Profilo creato!"
        subtitle={
          role === RolesEnum.CONSUMER
            ? "Da oggi puoi inviare richieste e prenotare assistenza vicino casa. 🏡"
            : "Completa gli ultimi passi e inizia a ricevere richieste. ✅"
        }
      />

      <div style={{ padding: "40px 20px", backgroundColor: "#ffffff" }}>
        {role === RolesEnum.CONSUMER ? (
          <>
            <h2
              style={{ color: "#333", fontSize: "22px", marginBottom: "20px" }}
            >
              Benvenuto/a&nbsp;{name}&nbsp;🌼
            </h2>
            <p
              style={{
                color: "#666",
                fontSize: "16px",
                lineHeight: "1.6",
                marginBottom: "20px",
              }}
            >
              il tuo profilo Famiglia è attivo. In pochi clic puoi trovare un
              Vigil nel tuo quartiere.
            </p>

            <p
              style={{
                color: "#666",
                fontSize: "16px",
                lineHeight: "1.6",
                marginBottom: "30px",
              }}
            >
              Come funziona:
            </p>

            <ol
              style={{
                color: "#666",
                fontSize: "16px",
                lineHeight: "1.6",
                marginBottom: "30px",
              }}
            >
              <li>Inserisci CAP o zona 📍</li>
              <li>Visualizza e scegli l&apos;assistente 👥</li>
              <li>Inserisci indirizzo e giorno/orario 📅</li>
              <li>Scegli il servizio 🏡</li>
              <li>
                prenota e Invia la richiesta → il Vigil accetta → ti contattiamo
                noi per organizzare tutto 🤝
              </li>
            </ol>
            <br />
            <p
              style={{
                color: "#666",
                fontSize: "16px",
                lineHeight: "1.6",
                marginBottom: "30px",
              }}
            >
              👉 Entra nella tua&nbsp;
              <a href={`${appUrl}${Routes.profileConsumer.url}`}>
                area personale
              </a>
              .
            </p>
          </>
        ) : (
          <>
            <h2
              style={{ color: "#333", fontSize: "22px", marginBottom: "20px" }}
            >
              Ciao&nbsp;{name}!&nbsp;👋
            </h2>
            <p
              style={{
                color: "#666",
                fontSize: "16px",
                lineHeight: "1.6",
                marginBottom: "20px",
              }}
            >
              grazie per esserti unito/a alla community Vigila! 😃
              <br />
              Il tuo profilo è attivo: da ora potrai ricevere richieste nella
              tua zona.
            </p>
            <p
              style={{
                color: "#666",
                fontSize: "16px",
                lineHeight: "1.6",
                marginBottom: "30px",
              }}
            >
              👉 Vai alla tua&nbsp;
              <a href={`${appUrl}${Routes.profileVigil.url}`}>area personale</a>
              .
            </p>
          </>
        )}

        <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.6" }}>
          Se hai domande o hai bisogno di supporto, non esitare a contattarci.
          Siamo qui per aiutarti!
        </p>
      </div>

      <EmailFooter />
    </div>
  );
}
