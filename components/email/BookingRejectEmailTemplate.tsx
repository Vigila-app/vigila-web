import { AppConstants } from "@/src/constants";
import * as React from "react";
import { EmailHeader } from "./EmailHeader";
import { EmailFooter } from "./EmailFooter";
import { dateDisplay } from "@/src/utils/date.utils";
import { ServicesUtils } from "@/src/utils/services.utils";
import { replaceDynamicUrl } from "@/src/utils/common.utils";
import { Routes } from "@/src/routes";

interface BookingRejectEmailProps {
  customerName: string;
  bookingId: string;
  serviceName: string;
  bookingDate: string | Date;
  bookingTime: string | Date;
  vigilName?: string;
  location: string;
  totalAmount: string;
  appUrl?: string;
  quantity?: number | string;
  unitType?: string;
}

export function BookingRejectEmailTemplate(
  {
    customerName,
    bookingId,
    serviceName,
    bookingDate,
    bookingTime,
    vigilName,
    location,
    totalAmount,
    appUrl = AppConstants.hostUrl,
    quantity,
    unitType,
  }: BookingRejectEmailProps,
  isVigil = false
) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        margin: "0 auto",
      }}
    >
      <EmailHeader
        title="Prenotazione Rifiutata ❌"
        subtitle="Niente panico: ti aiutiamo subito a trovare un’alternativa.🤝"
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
          Ciao&nbsp;{customerName}
        </h2>

        <p
          style={{
            color: "#666",
            fontSize: "16px",
            lineHeight: "1.6",
          }}
        >
          purtroppo {vigilName} non è disponibile per la data/ora richiesta.
        </p>
        <p
          style={{
            color: "#666",
            fontSize: "16px",
            lineHeight: "1.6",
          }}
        >
          La buona notizia? Ti supportiamo noi a trovare un&apos;alternativa
          subito tra i Vigil della zona.
        </p>
        <br />

        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <a
            href={`${appUrl}${replaceDynamicUrl(Routes.bookingDetails.url, ":bookingId", bookingId)}`}
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
            Gestisci Prenotazione
          </a>
        </div>

        <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6" }}>
          👉 Scegli un altro Vigil oppure contattaci subito per ricevere
          supporto dal nostro team&nbsp;📲
          <br />
          Grazie per la pazienza
        </p>
      </div>

      <EmailFooter />
    </div>
  );
}
