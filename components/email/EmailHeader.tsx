import * as React from 'react';
import Logo from '@/components/logo/logo';

interface EmailHeaderProps {
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  titleColor?: string;
}

export function EmailHeader({
  title,
  subtitle,
  backgroundColor = '#fff',
  titleColor = 'black',
}: EmailHeaderProps) {
  return (
    <div style={{ backgroundColor, padding: '24px 20px', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: title || subtitle ? '12px' : 0 }}>
        <Logo size="small" />
      </div>

      {title && (
        <h1 style={{ color: titleColor, fontSize: '22px', margin: '6px 0' }}>{title}</h1>
      )}

      {subtitle && (
        <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>{subtitle}</p>
      )}
    </div>
  );
}

export default EmailHeader;
