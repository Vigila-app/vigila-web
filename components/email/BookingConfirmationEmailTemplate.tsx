import { AppConstants } from "@/src/constants";
import * as React from "react";
import { EmailHeader } from "./EmailHeader";
import { EmailFooter } from "./EmailFooter";
import { dateDisplay } from "@/src/utils/date.utils";
import { ServicesUtils } from "@/src/utils/services.utils";
import { replaceDynamicUrl } from "@/src/utils/common.utils";
import { Routes } from "@/src/routes";

interface BookingConfirmationEmailProps {
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

export function BookingConfirmationEmailTemplate(
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
  }: BookingConfirmationEmailProps,
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
        title={
          isVigil
            ? `Nuova Prenotazione Assegnata ✅`
            : `Prenotazione Confermata ✅`
        }
        subtitle={
          !isVigil
            ? "Ti chiamiamo noi per gli ultimi dettagli pratici."
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
        <h2 style={{ color: "#333", fontSize: "22px", marginBottom: "20px" }}>
          Ciao&nbsp;{customerName}&nbsp;🎉
        </h2>

        <p
          style={{
            color: "#666",
            fontSize: "16px",
            lineHeight: "1.6",
          }}
        >
          {!isVigil &&
            `il Vigil ${vigilName} ha confermato la tua richiesta. ✔️`}
        </p>
        <br />
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "30px",
            border: "1px solid #dee2e6",
          }}
        >
          <h3
            style={{
              color: "#333",
              fontSize: "18px",
              marginBottom: "15px",
              marginTop: "0",
            }}
          >
            Riepilogo:
          </h3>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tr>
              <td
                style={{
                  padding: "8px 0",
                  color: "#666",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Quando:
              </td>
              <td style={{ padding: "8px 0", color: "#333", fontSize: "14px" }}>
                {dateDisplay(bookingDate, "dateTime")}
                {quantity && unitType && (
                  <>
                    &nbsp;-&nbsp;{quantity}&nbsp;
                    {ServicesUtils.getServiceUnitType(unitType)}
                  </>
                )}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "8px 0",
                  color: "#666",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Dove:
              </td>
              <td style={{ padding: "8px 0", color: "#333", fontSize: "14px" }}>
                {location}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "8px 0",
                  color: "#666",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Servizio:
              </td>
              <td style={{ padding: "8px 0", color: "#333", fontSize: "14px" }}>
                {serviceName}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "8px 0",
                  color: "#666",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Totale:
              </td>
              <td
                style={{
                  padding: "8px 0",
                  color: "#333",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                €{totalAmount}&nbsp;(pagamento tracciato in app)
              </td>
            </tr>
          </table>
        </div>

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

        <p
          style={{
            color: "#0066cc",
            fontSize: "14px",
            margin: "0",
            fontWeight: "bold",
          }}
        >
          📞 Concierge Vigila: ti contatteremo a breve per allineare ingresso in
          casa, note utili e ogni dettaglio.
        </p>

        <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6" }}>
          Per qualsiasi domanda o necessità di modifiche, contattaci tramite
          l&apos;assistenza clienti.
        </p>
      </div>

      <EmailFooter />
    </div>
  );
}
