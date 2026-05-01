# Design: Selezione Servizio nel Flusso Post-Onboarding Singolo

## Problema

Il flusso post-onboarding consente al consumer di scegliere se fare una prenotazione **singola** o **ricorrente**. Il flusso ricorrente ha uno step dedicato per la selezione del servizio dal catalogo globale (`Services.tsx`). Il flusso singolo no: utilizza `BookingFormComponent` senza vigil preselezionato, il quale attende una lista di servizi dal `useServicesStore` (caricate solo se esiste un vigil). **Di conseguenza, l'utente non può scegliere il servizio nel flusso singolo**, anche se è richiesto per il matching algoritmo.

### Impatto attuale

- Matching riceve `service_type` calcolato con fallback hardcoded a `LIGHT_ASSISTANCE` ([src/services/matching.service.ts:148](src/services/matching.service.ts#L148))
- L'utente non ha alcun controllo sulla scelta del servizio
- Flusso singolo e ricorrente sono asimmetrici pur facendo parte della stessa onboarding

---

## Opzione A: Modificare BookingForm

Aggiungere logica di selezione servizio direttamente nel `BookingFormComponent`, attivabile condizionalmente quando manca `serviceId/vigilId`.

### Pro

- Tocco singolo; nessuno step nuovo
- Riusa data/indirizzo/durata/note già presenti in BookingForm
- Meno wiring in AvailabilityFlow

### Contro

- **BookingForm è già complesso** (~810 righe): gestisce due forme di servizio (`ServiceI` vs `ServiceCatalogItem`) con casting promiscuo. Una terza modalità aumenta significativamente la complessità.
- **Mescola domini**: BookingForm è nato per la creazione di prenotazioni con vigil concreto (relazione 1:1). Aggiungere selezione da catalogo globale lo rende un ibrido che confonde il flusso matching (input per algoritmo) con il flusso di creazione (prenotazione effettiva).
- **Rischio regressione**: il classico flusso (`/booking/create?serviceId=X&vigilId=Y`) potrebbe subire regressioni sulla logica `serviceOptions`/store.
- **UX disallineata**: il ricorrente ha servizio in uno **step dedicato**, il singolo l'avrebbe inline → asimmetria visiva e di interazione nel medesimo flusso onboarding.
- **Shape dati frammentata**: il singolo produrrebbe `service_id` (vuoto) mentre il matching cerca `answers.services[weekday]` → logica di mappatura sparsa e fragile.

---

## Opzione B: Aggiungere Step di Selezione Servizio (SCELTA ATTUATA)

Inserire uno step `single-service` nel `AvailabilityFlow` tra `welcome` e `single-booking`, attivato per booking-type `OCCASIONAL/TRIAL`. Replica la struttura del ricorrente, riutilizza il catalogo globale, scrive dati nella stessa shape di `Services.tsx`.

### Pro

- **Coerenza UX totale**: ricorrente e singolo seguono lo stesso schema visivo e d'interazione. Stesso `Step.tsx` renderer. L'utente non percepisce discontinuità.
- **Zero impatto su BookingForm**: il flusso classico (`/booking/create`) rimane invariato → rischio regressione = 0.
- **Shape uniforme**: singolo produce `answers.services[weekday] = { services: label, car, notes }` come il ricorrente. `buildMatchingRequestFromAnswers` funziona senza modifiche, niente fallback `LIGHT_ASSISTANCE`.
- **Isolamento pulito**: catalogo vs servizi-vigil rimane disaccoppiato a livello AvailabilityFlow; BookingForm resta la forma pura per la creazione di booking.
- **Riuso**: opportunità di riutilizzare componenti UI e pattern già rodati (`SingleService.tsx`, card styling, toggle car/notes).

### Contro

- Un componente nuovo + una voce in flow config
- Bisogna propagare `service_type`/`car`/`notes` da answers a monte fino a `services[weekday]` quando il form si monta

---

## Implementazione (Opzione B)

### 1. Nuovo File: `SingleBookingService.tsx`

Component con firma `{ answers, setAnswers, role, isLastStep }` (come `Services.tsx`).

**Funzionalità:**

- Griglia card del catalogo globale da `ServicesService.getServicesCatalog()`
- Selezione singola (radio-like behavior)
- Checkbox "Accompagnamento in auto" (car)
- Textarea note
- Pari al ricorrente, ma mono-servizio

**Salva in answers:**

- `service_type`: enum dal catalogo
- `car`: boolean
- `notes`: string

### 2. Modifica: `AvailabilityFlow.tsx`

```tsx
// Aggiungere import
import { SingleBookingService } from "./SingleBookingService";

// Nel welcome step, update nextStep
nextStep: (answers) => {
  if (answers["booking-type"] == BookingTypeEnum.OCCASIONAL ||
      answers["booking-type"] == BookingTypeEnum.TRIAL) {
    return "single-service";  // ← era "single-booking"
  }
  return "availabilities";
},

// Aggiungere nuovo step prima di single-booking
{
  id: "single-service",
  title: "",
  description: "",
  questions: [],
  component: SingleBookingService,
  nextStep: "single-booking",
},
```

### 3. Modifica: `SingleBooking.tsx`

**Estendi logica di form-change:**

- Preferisci `prev.service_type` (settato dal nuovo step) al posto di `form?.service_type`
- Quando scrivi `services[weekday]`, includi `car` e `notes` da answers a monte

**Aggiungi prop a BookingFormComponent:**

```tsx
<BookingFormComponent
  booking={bookingPrefill as any}
  catalogServiceType={catalogServiceType} // ← nuova prop
  onSubmit={handleOnSubmit}
  onFormChange={updateAnswersFromForm}
/>
```

### 4. Modifica: `BookingFormComponent.tsx`

**Aggiungi prop:**

```tsx
type BookingFormComponentI = {
  // ... existing ...
  catalogServiceType?: ServiceCatalogTypeEnum; // ← nuova
  // ... existing ...
};
```

**Estendi selectedService resolution:**

```tsx
const selectedService = useMemo(() => {
  // ... existing notice/watch logic ...

  if (!(watchedServiceId || serviceId || booking?.service_id)) {
    if (catalogServiceType) {
      const service = ServicesService.getServicesByType(catalogServiceType);
      if (service) return service;
    }
    return;
  }

  // ... existing ...
}, [
  watchedServiceId,
  services,
  serviceId,
  vigilId,
  booking,
  noticeProposal?.service_type,
  catalogServiceType, // ← aggiungere alla lista dipendenze
]);
```

**Risultato:** il campo "Servizio" mostra il nome del servizio scelto come riepilogo (read-only), il riepilogo finale mostra prezzo indicativo dal catalogo.

---

## Effetti Positivi

### Flusso matching

- `buildMatchingRequestFromAnswers` riceve `services[weekday]` con label corretta dal catalogo
- Niente fallback `LIGHT_ASSISTANCE`
- Shape identica tra ricorrente e singolo

### Coerenza onboarding

- Ricorrente e singolo hanno lo stesso ordine di step e stile visivo
- Non c'è una "forma breve del form" — c'è uno step pulito, poi il form

### Sicurezza

- Zero modifiche a `/booking/create` → classico booking invariato
- Prop opzionale su BookingForm → default behavior preservato

---

## File Modificati

| File                                                             | Tipo       | Descrizione                                                                |
| ---------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------- |
| `components/calendar/AvailabilityRules/SingleBookingService.tsx` | **CREATO** | Step selezione servizio singolo + car + notes                              |
| `components/calendar/AvailabilityRules/AvailabilityFlow.tsx`     | MODIFICATO | Import + route welcome→single-service per OCCASIONAL/TRIAL + aggiunta step |
| `components/calendar/AvailabilityRules/SingleBooking.tsx`        | MODIFICATO | Legge service_type/car/notes da prev, prop catalogServiceType              |
| `components/bookings/bookingForm.component.tsx`                  | MODIFICATO | Prop catalogServiceType, selectedService resolution dal catalogo           |

---

## Testing

### Flusso happy path

1. Utente in `/booking/inizialization`
2. Sceglie "Una volta"
3. → Step `single-service`: sceglie "Compagnia e conversazione", toggle car, aggiunge nota
4. → Step `single-booking`: vede data/indirizzo/durata, il campo Servizio mostra "Compagnia e conversazione" come recap read-only
5. Compila form, submit → form valida (no servizio required: selectedService è noto), onFormChange popola `answers.services[weekday]` con label + car + notes
6. → `onComplete` → sessionStorage → `/matching/loading`
7. Matching riceve `schedule[0] = { start, end, service: "companionship" }` (enum corretto, no fallback)

### Flusso classico (regressione check)

1. Utente in `/booking/create?serviceId=X&vigilId=Y`
2. BookingFormComponent riceve serviceId + vigilId
3. `catalogServiceType` non è passato (prop opzionale, default undefined)
4. selectedService risolve via store/serviceId path attuale
5. Niente cambia

---

## Decision

**Opzione B implementata** per coerenza UX, isolamento domini, riuso componenti e zero rischio su flussi esistenti.
