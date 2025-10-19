import { AppConstants } from "@/src/constants";
import * as React from "react";
import { EmailHeader } from "./EmailHeader";
import { EmailFooter } from "./EmailFooter";
import { dateDisplay } from "@/src/utils/date.utils";
import { ServicesUtils } from "@/src/utils/services.utils";

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
        subtitle={undefined}
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
          Ciao {isVigil ? vigilName : customerName}!
        </h2>

        <p
          style={{
            color: "#666",
            fontSize: "16px",
            lineHeight: "1.6",
          }}
        >
          {isVigil
            ? `Ti abbiamo assegnato una nuova prenotazione.`
            : "La tua prenotazione è stata confermata."}
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
            Dettagli Prenotazione
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
                ID Prenotazione:
              </td>
              <td style={{ padding: "8px 0", color: "#333", fontSize: "14px" }}>
                #{bookingId}
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
                Data:
              </td>
              <td style={{ padding: "8px 0", color: "#333", fontSize: "14px" }}>
                {dateDisplay(bookingDate, "dateTime")}
              </td>
            </tr>
            {quantity && unitType && (
              <tr>
                <td
                  style={{
                    padding: "8px 0",
                    color: "#666",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  Durata:
                </td>
                <td
                  style={{ padding: "8px 0", color: "#333", fontSize: "14px" }}
                >
                  {quantity}&nbsp;{ServicesUtils.getServiceUnitType(unitType)}
                </td>
              </tr>
            )}
            {!isVigil && vigilName && (
              <tr>
                <td
                  style={{
                    padding: "8px 0",
                    color: "#666",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  Vigil:
                </td>
                <td
                  style={{ padding: "8px 0", color: "#333", fontSize: "14px" }}
                >
                  {vigilName}
                </td>
              </tr>
            )}
            {isVigil && customerName && (
              <tr>
                <td
                  style={{
                    padding: "8px 0",
                    color: "#666",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  Cliente:
                </td>
                <td
                  style={{ padding: "8px 0", color: "#333", fontSize: "14px" }}
                >
                  {customerName}
                </td>
              </tr>
            )}
            <tr>
              <td
                style={{
                  padding: "8px 0",
                  color: "#666",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Luogo:
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
                €{totalAmount}
              </td>
            </tr>
          </table>
        </div>

        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <a
            href={`${appUrl}/bookings/${bookingId}`}
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
            Visualizza Prenotazione
          </a>
        </div>

        <div
          style={{
            backgroundColor: "#e7f3ff",
            padding: "15px",
            borderRadius: "6px",
            borderLeft: "4px solid #007bff",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              color: "#0066cc",
              fontSize: "14px",
              margin: "0",
              fontWeight: "bold",
            }}
          >
            💡 Cosa fare ora:
          </p>
          <ul
            style={{
              color: "#0066cc",
              fontSize: "14px",
              margin: "10px 0 0 0",
              paddingLeft: "20px",
            }}
          >
            <li>Assicurati di essere presente all&apos;orario concordato</li>
            <li>
              Tieni a portata di mano il tuo telefono per eventuali
              comunicazioni
            </li>
            <li>Prepara eventuali documenti richiesti per il servizio</li>
          </ul>
        </div>

        <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6" }}>
          Per qualsiasi domanda o necessità di modifiche, contattaci tramite
          l&apos;assistenza clienti.
        </p>
      </div>

      <EmailFooter />
    </div>
  );
}
