import { AppConstants } from "@/src/constants";
import * as React from "react";
import { EmailHeader } from "./EmailHeader";
import { EmailFooter } from "./EmailFooter";
import { dateDisplay } from "@/src/utils/date.utils";

interface BookingCancellationEmailProps {
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

export function BookingCancellationEmailTemplate(
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
  }: BookingCancellationEmailProps,
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
        title="Prenotazione Annullata ❌"
        subtitle={
          !isVigil
            ? "Ti proponiamo un sostituto nelle stesse fasce."
            : undefined
        }
      />

      <div
        style={{
          padding: "20px",
          backgroundColor: "#ffffff",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        {isVigil ? (
          <>
            <h2
              style={{ color: "#333", fontSize: "22px", marginBottom: "20px" }}
            >
              Ciao&nbsp;{vigilName}
            </h2>
            <p
              style={{
                color: "#666",
                fontSize: "16px",
                lineHeight: "1.6",
              }}
            >
              {customerName}&nbsp;ha annullato la prenotazione
              <br />
              <strong>{bookingId}</strong>
              <br />({dateDisplay(bookingDate, "dateTime")}). 📅 😕
            </p>
            <p
              style={{
                color: "#666",
                fontSize: "16px",
                lineHeight: "1.6",
              }}
            >
              Lo slot è di nuovo disponibile: potrai ricevere altre richieste in
              quell&apos;orario.
            </p>
            <br />
          </>
        ) : (
          <>
            <h2
              style={{ color: "#333", fontSize: "22px", marginBottom: "20px" }}
            >
              Ciao&nbsp;{customerName}
            </h2>
            <p
              style={{
                color: "#666",
                fontSize: "16px",
                lineHeight: "1.6",
              }}
            >
              il Vigil&nbsp;{vigilName}&nbsp;ha annullato la prenotazione
              <br />
              <strong>{bookingId}</strong>
              <br />
              del&nbsp;
              {dateDisplay(bookingDate, "dateTime")}.
            </p>
            <h4
              style={{ color: "#333", fontSize: "18px", marginBottom: "12px" }}
            >
              🎯 Cosa facciamo ora?
            </h4>
            <p
              style={{
                color: "#666",
                fontSize: "16px",
                lineHeight: "1.6",
              }}
            >
              Stiamo cercando un sostituto nelle stesse fasce orarie. Ti
              manderemo una proposta a breve.
            </p>
          </>
        )}

        <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6" }}>
          Per qualsiasi domanda o necessità di modifiche, contattaci tramite
          l&apos;assistenza clienti.
        </p>
        <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6" }}>
          Scusaci per il disagio.
        </p>
      </div>

      <EmailFooter />
    </div>
  );
}
