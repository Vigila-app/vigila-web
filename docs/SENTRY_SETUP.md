# Sentry Integration - Vigila App

## Panoramica

Questo progetto integra Sentry per il monitoraggio degli errori e delle performance. Sentry fornisce visibilità in tempo reale su errori, performance e user experience.

## Configurazione

### 1. Variabili d'ambiente

Aggiungi le seguenti variabili d'ambiente nel tuo file `.env.local`:

```bash
# Sentry DSN - Ottieni dal tuo progetto Sentry
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id

# Organizzazione e progetto Sentry (per source maps)
SENTRY_ORG=your-organization
SENTRY_PROJECT=your-project

# Configurazione performance monitoring (opzionale)
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=1.0
NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.1
NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=1.0

# Versione dell'app (opzionale)
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 2. Come ottenere il DSN di Sentry

1. Crea un account su [sentry.io](https://sentry.io)
2. Crea un nuovo progetto Next.js
3. Copia il DSN dal tuo progetto Sentry
4. Aggiungi il DSN come `NEXT_PUBLIC_SENTRY_DSN` nel tuo `.env.local`

## Funzionalità implementate

### 1. Monitoraggio errori automatico

- **Error Boundary**: Cattura automaticamente errori JavaScript non gestiti nei componenti React
- **API Routes**: Monitoring automatico degli errori nelle route API
- **Middleware**: Tracking degli errori nel middleware Next.js

### 2. User Context

- Associazione automatica degli errori agli utenti autenticati
- Tracking delle informazioni di sessione

### 3. Performance Monitoring

- Monitoraggio delle performance delle API
- Tracking dei tempi di caricamento
- Session Replay per debugging

### 4. Breadcrumbs

- Tracking automatico del flusso di navigazione
- Eventi di autenticazione
- Operazioni CRUD

## Utilizzo

### Utility SentryUtils

Il progetto fornisce una utility centralizzata per interagire con Sentry:

```typescript
import { SentryUtils } from '@/src/utils/sentry.utils';

// Cattura un errore manualmente
SentryUtils.captureError(error, {
  operation: 'fetchUserData',
  userId: user.id
});

// Aggiungi context personalizzato
SentryUtils.setContext('userAction', {
  action: 'createBooking',
  timestamp: new Date().toISOString()
});

// Aggiungi breadcrumbs
SentryUtils.addBreadcrumb('User clicked submit button', 'ui', 'info');

// Wrapper per operazioni async con error handling
const result = await SentryUtils.withErrorHandling(
  () => apiCall(),
  'apiCallOperation'
);
```

### Error Boundary

Il componente `SentryErrorBoundary` è già integrato nel layout principale e cattura automaticamente errori non gestiti:

```tsx
// Uso personalizzato in componenti specifici
<SentryErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</SentryErrorBoundary>
```

## Integrazione esistente

### Store (Zustand)

Gli store esistenti sono stati aggiornati per inviare automaticamente errori a Sentry:

- `adminStore`: Errori nelle operazioni admin
- Altri store: Pattern simile per consistency

### API Routes

Le API routes utilizzano la funzione `jsonErrorResponse` che ora include il tracking Sentry.

### ApiService Integration

L'`ApiService` è stato integrato con Sentry per il monitoraggio automatico di tutte le chiamate HTTP:

#### Errori HTTP tracked automaticamente:
- **4xx errors**: Errori client (bad request, unauthorized, etc.)
- **5xx errors**: Errori server
- **Network errors**: Timeout, connection failed, etc.
- **Parsing errors**: Errori di parsing JSON

#### Breadcrumbs automatici:
- Tutte le chiamate API fallite
- Chiamate API critiche di successo (pagamenti, prenotazioni)

#### Context informazioni incluse:
```typescript
{
  apiError: true,
  url: "https://api.example.com/endpoint",
  method: "POST",
  status: 500,
  statusText: "Internal Server Error",
  errorResponse: { code: 1001, message: "Database error" },
  timestamp: "2024-07-28T10:30:00.000Z"
}
```

### Session Management

Il `SessionManagerComponent` ora:
- Inizializza Sentry all'avvio dell'app
- Traccia eventi di autenticazione
- Imposta il contesto utente

## Best Practices

### 1. Filtraggio errori

Sentry è configurato per filtrare errori non critici come:
- Errori di rete comuni
- AbortError da fetch cancellate
- ChunkLoadError (errori di caricamento JS)

### 2. Privacy

- Session Replay maschera automaticamente tutto il testo e i media
- Non vengono inviate informazioni sensibili nei context

### 3. Performance

- Sentry è disabilitato in development per evitare rumore
- Sample rate configurabili per controllo dei costi

## Monitoraggio in produzione

### Dashboard Sentry

1. **Issues**: Visualizza tutti gli errori catturati
2. **Performance**: Monitora i tempi di risposta delle API
3. **Releases**: Traccia errori per versione
4. **User Feedback**: Feedback automatico dagli utenti

### Alerting

Configura alert su Sentry per:
- Nuovi errori
- Aumento del tasso di errore
- Performance degradation

## Troubleshooting

### Sentry non invia errori

1. Verifica che `NEXT_PUBLIC_SENTRY_DSN` sia impostato correttamente
2. Controlla che non sia in development (Sentry è disabilitato in dev)
3. Verifica la console per errori di inizializzazione

### Source maps non funzionano

1. Verifica che `SENTRY_ORG` e `SENTRY_PROJECT` siano corretti
2. Controlla i permessi del token Sentry
3. Verifica che il build sia completato senza errori

### Performance impact

Il monitoring Sentry ha un impatto minimo sulle performance:
- Bundle size: ~50KB gzipped
- Runtime overhead: <1ms per request
- Sample rate configurabile per controllo

## File di configurazione

- `sentry.client.config.ts`: Configurazione client-side
- `sentry.server.config.ts`: Configurazione server-side  
- `sentry.edge.config.ts`: Configurazione edge runtime
- `src/utils/sentry.utils.ts`: Utility centralizzata
- `src/constants/sentry.constants.ts`: Costanti di configurazione
