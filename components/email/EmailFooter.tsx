import * as React from 'react';
import LogoFooter from '@/components/logo/logoFooter';
import { AppConstants } from '@/src/constants';

interface EmailFooterProps {
  small?: boolean;
  copyrightText?: string;
}

export function EmailFooter({ small = false, copyrightText } : EmailFooterProps) {
  return (
    <div style={{ backgroundColor: '#f8f9fa', padding: small ? '12px' : '20px', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
        <LogoFooter size={small ? 'small' : 'normal'} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
        <a href={AppConstants.whatsappUrl} style={{ color: '#25D366', textDecoration: 'none' }} aria-label="WhatsApp">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.52 3.48A11.84 11.84 0 0012 .08C6.36.08 1.84 3.82 1 8.66L.02 12l3.58-.94A11.9 11.9 0 0012 22c2.95 0 5.7-1 7.78-2.85A11.88 11.88 0 0024 8.66c0-.99-.12-1.96-.36-2.88a1.32 1.32 0 00-1.12-1.3z" fill="#25D366"/>
            <path d="M17.67 14.2c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.36.22-.66.07-.3-.15-1.25-.46-2.38-1.46-.88-.78-1.48-1.74-1.65-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.17.2-.28.3-.48.1-.2 0-.37-.05-.52-.05-.15-.68-1.64-.93-2.25-.24-.59-.48-.5-.66-.51l-.56-.01c-.19 0-.5.07-.77.36-.27.29-1.03 1-1.03 2.44 0 1.44 1.06 2.83 1.21 3.03.15.2 2.09 3.2 5.06 4.48 2.39 1.06 2.72 1.02 3.21.96.49-.06 1.55-.63 1.77-1.24.22-.61.22-1.13.15-1.24-.07-.11-.27-.17-.57-.31z" fill="#fff"/>
          </svg>
        </a>

        <a href={AppConstants.instagramUrl} style={{ color: '#E1306C', textDecoration: 'none' }} aria-label="Instagram">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z" stroke="#E1306C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" stroke="#E1306C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17.5 6.5h.01" stroke="#E1306C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

      <p style={{ color: '#888', fontSize: small ? '12px' : '14px', margin: 0 }}>
        {copyrightText || `© ${new Date().getFullYear()} Vigila. Tutti i diritti riservati.`}
      </p>
    </div>
  );
}

export default EmailFooter;
