import * as React from 'react';

interface BookingConfirmationEmailProps {
  customerName: string;
  bookingId: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  vigilName?: string;
  location: string;
  totalAmount: string;
  appUrl?: string;
}

export function BookingConfirmationEmailTemplate({
  customerName,
  bookingId,
  serviceName,
  bookingDate,
  bookingTime,
  vigilName,
  location,
  totalAmount,
  appUrl = 'https://vigila.app'
}: BookingConfirmationEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#28a745', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', fontSize: '28px', marginBottom: '10px' }}>
          Prenotazione Confermata ✅
        </h1>
        <p style={{ color: '#ffffff', fontSize: '16px', margin: '0' }}>
          La tua prenotazione è stata elaborata con successo
        </p>
      </div>
      
      <div style={{ padding: '40px 20px', backgroundColor: '#ffffff' }}>
        <h2 style={{ color: '#333', fontSize: '22px', marginBottom: '20px' }}>
          Ciao {customerName}!
        </h2>
        
        <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
          La tua prenotazione è stata confermata. Ecco i dettagli del tuo servizio:
        </p>
        
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '30px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ color: '#333', fontSize: '18px', marginBottom: '15px', marginTop: '0' }}>
            Dettagli Prenotazione
          </h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tr>
              <td style={{ padding: '8px 0', color: '#666', fontSize: '14px', fontWeight: 'bold' }}>
                ID Prenotazione:
              </td>
              <td style={{ padding: '8px 0', color: '#333', fontSize: '14px' }}>
                #{bookingId}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#666', fontSize: '14px', fontWeight: 'bold' }}>
                Servizio:
              </td>
              <td style={{ padding: '8px 0', color: '#333', fontSize: '14px' }}>
                {serviceName}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#666', fontSize: '14px', fontWeight: 'bold' }}>
                Data:
              </td>
              <td style={{ padding: '8px 0', color: '#333', fontSize: '14px' }}>
                {bookingDate}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#666', fontSize: '14px', fontWeight: 'bold' }}>
                Orario:
              </td>
              <td style={{ padding: '8px 0', color: '#333', fontSize: '14px' }}>
                {bookingTime}
              </td>
            </tr>
            {vigilName && (
              <tr>
                <td style={{ padding: '8px 0', color: '#666', fontSize: '14px', fontWeight: 'bold' }}>
                  Vigile:
                </td>
                <td style={{ padding: '8px 0', color: '#333', fontSize: '14px' }}>
                  {vigilName}
                </td>
              </tr>
            )}
            <tr>
              <td style={{ padding: '8px 0', color: '#666', fontSize: '14px', fontWeight: 'bold' }}>
                Luogo:
              </td>
              <td style={{ padding: '8px 0', color: '#333', fontSize: '14px' }}>
                {location}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#666', fontSize: '14px', fontWeight: 'bold' }}>
                Totale:
              </td>
              <td style={{ padding: '8px 0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                €{totalAmount}
              </td>
            </tr>
          </table>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <a 
            href={`${appUrl}/bookings/${bookingId}`}
            style={{
              backgroundColor: '#007bff',
              color: '#ffffff',
              padding: '12px 30px',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'inline-block',
              marginRight: '10px'
            }}
          >
            Visualizza Prenotazione
          </a>
        </div>
        
        <div style={{ 
          backgroundColor: '#e7f3ff', 
          padding: '15px', 
          borderRadius: '6px', 
          borderLeft: '4px solid #007bff',
          marginBottom: '20px'
        }}>
          <p style={{ color: '#0066cc', fontSize: '14px', margin: '0', fontWeight: 'bold' }}>
            💡 Cosa fare ora:
          </p>
          <ul style={{ color: '#0066cc', fontSize: '14px', margin: '10px 0 0 0', paddingLeft: '20px' }}>
            <li>Assicurati di essere presente all&apos;orario concordato</li>
            <li>Tieni a portata di mano il tuo telefono per eventuali comunicazioni</li>
            <li>Prepara eventuali documenti richiesti per il servizio</li>
          </ul>
        </div>
        
        <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
          Per qualsiasi domanda o necessità di modifiche, contattaci tramite l&apos;app 
          o rispondi a questa email.
        </p>
      </div>
      
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', textAlign: 'center' }}>
        <p style={{ color: '#888', fontSize: '14px', margin: '0' }}>
          © 2025 Vigila. Tutti i diritti riservati.
        </p>
      </div>
    </div>
  );
}
