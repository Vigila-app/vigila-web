import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/src/services/email.service';
import { EmailConstants } from '@/src/constants/email.constants';
import {
  WelcomeEmailDataI,
  BookingConfirmationEmailDataI,
} from '@/src/types/email.types';

// Tipi per le richieste API
interface WelcomeEmailRequest {
  type: 'welcome';
  to: string;
  firstName: string;
  appUrl?: string;
}

interface BookingConfirmationRequest {
  type: 'booking-confirmation';
  to: string;
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

type EmailRequest = WelcomeEmailRequest | BookingConfirmationRequest;

export async function POST(request: NextRequest) {
  try {
    const body: EmailRequest = await request.json();

    // Validazione del tipo di email
    if (!body.type || !body.to) {
      return NextResponse.json(
        { error: 'Parametri mancanti: type e to sono obbligatori' },
        { status: 400 }
      );
    }

    let result;

    switch (body.type) {
      case 'welcome': {
        const { to, firstName, appUrl } = body as WelcomeEmailRequest;
        
        if (!firstName) {
          return NextResponse.json(
            { error: 'firstName è obbligatorio per le email di benvenuto' },
            { status: 400 }
          );
        }

        result = await EmailService.sendWelcomeEmail({
          to,
          firstName,
          appUrl,
        });
        break;
      }

      case 'booking-confirmation': {
        const {
          to,
          customerName,
          bookingId,
          serviceName,
          bookingDate,
          bookingTime,
          vigilName,
          location,
          totalAmount,
          appUrl,
        } = body as BookingConfirmationRequest;

        // Validazione dei campi obbligatori
        const requiredFields = {
          customerName,
          bookingId,
          serviceName,
          bookingDate,
          bookingTime,
          location,
          totalAmount,
        };

        const missingFields = Object.entries(requiredFields)
          .filter(([, value]) => !value)
          .map(([key]) => key);

        if (missingFields.length > 0) {
          return NextResponse.json(
            { error: `Campi obbligatori mancanti: ${missingFields.join(', ')}` },
            { status: 400 }
          );
        }

        result = await EmailService.sendBookingConfirmationEmail({
          to,
          customerName,
          bookingId,
          serviceName,
          bookingDate,
          bookingTime,
          vigilName,
          location,
          totalAmount,
          appUrl,
        });
        break;
      }

      default:
        return NextResponse.json(
          { error: `Tipo di email non supportato: ${(body as any).type}` },
          { status: 400 }
        );
    }

    if (!result.success) {
      console.error('Errore invio email:', result.error);
      return NextResponse.json(
        { error: 'Errore durante l\'invio dell\'email', details: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email inviata con successo',
      emailId: result.data?.id,
    });

  } catch (error) {
    console.error('Errore API email:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// Endpoint GET per testare la configurazione
// export async function GET() {
//   return NextResponse.json({
//     message: 'API Email Vigila attiva',
//     supportedTypes: ['welcome', 'booking-confirmation'],
//     version: '1.0.0',
//   });
// }
