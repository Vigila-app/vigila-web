import * as React from 'react';

interface WelcomeEmailProps {
  firstName: string;
  appUrl?: string;
}

export function WelcomeEmailTemplate({ firstName, appUrl = 'https://vigila.app' }: WelcomeEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#f8f9fa', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ color: '#333', fontSize: '28px', marginBottom: '10px' }}>
          Benvenuto in Vigila!
        </h1>
        <p style={{ color: '#666', fontSize: '16px', margin: '0' }}>
          La tua sicurezza è la nostra priorità
        </p>
      </div>
      
      <div style={{ padding: '40px 20px', backgroundColor: '#ffffff' }}>
        <h2 style={{ color: '#333', fontSize: '22px', marginBottom: '20px' }}>
          Ciao {firstName}! 👋
        </h2>
        
        <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
          Siamo entusiasti di averti a bordo! Vigila è la piattaforma che ti permette di 
          prenotare servizi di vigilanza in modo semplice e sicuro.
        </p>
        
        <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
          Con Vigila puoi:
        </p>
        
        <ul style={{ color: '#666', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
          <li>Prenotare servizi di vigilanza personalizzati</li>
          <li>Monitorare lo stato delle tue prenotazioni</li>
          <li>Comunicare direttamente con i vigilantes</li>
          <li>Gestire i pagamenti in sicurezza</li>
        </ul>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <a 
            href={appUrl}
            style={{
              backgroundColor: '#007bff',
              color: '#ffffff',
              padding: '12px 30px',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'inline-block'
            }}
          >
            Inizia ora
          </a>
        </div>
        
        <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6' }}>
          Se hai domande o hai bisogno di supporto, non esitare a contattarci. 
          Siamo qui per aiutarti!
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
