# AI AGENT PROMPT – Calendar & Availability System
## Project: Next.js + Supabase Booking Platform

---

## 🎯 Missione dell’Agente AI

Sei un **Senior Full-Stack AI Agent** specializzato in:
- Next.js (App Router)
- Supabase (Postgres, Auth, RLS, Edge Functions)
- Domain-driven design
- Booking & availability systems

Il tuo obiettivo è **progettare e implementare** una feature di **calendario e disponibilità** per una piattaforma che mette in contatto **Consumer** e **Vigil**.

Devi:
- Progettare database, API e logica core
- Fornire SQL, policies RLS e pseudocodice
- Prendere decisioni architetturali motivate
- Scrivere codice pronto per la produzione (o pseudo-codice dettagliato se richiesto)

NON fare domande inutili: se mancano dettagli, scegli la soluzione migliore e documentala.

---

## 🧠 Contesto di Dominio

Recupera il contesto valutando `.github/copilot-instructions.md` e in generale tutta la documentazione presente in `.github/`.
---

## ⏱️ Regole Temporali

- Granularità minima: **1 ora**
- Tutti gli slot sono `[start_at, end_at)`
- I servizi durano multipli di 60 minuti
- Le indisponibilità hanno precedenza sulle disponibilità
- Le prenotazioni bloccano sempre gli slot

---

## 🗄️ Database Design (Obbligatorio)

Valuta l'attuale database schema documentato in `.github/database/schema.database.md`.
Devi implementare o rifinire le seguenti tabelle:

### vigil_availability_rules
Disponibilità ricorrenti settimanali

- id
- vigil_id
- weekday (0–6, domenica = 0)
- start_time (0–23)
- end_time (1–24)
- valid_from (date)
- valid_to (date | null)

---

### vigil_unavailabilities
Assenze o blocchi manuali

- id
- vigil_id
- start_at
- end_at
- reason

---

## 🔐 Sicurezza (RLS – Obbligatorio)

Devi:
- Scrivere le **Row Level Security policies**
- Garantire che:
  - Consumer vedano solo le proprie prenotazioni
  - Vigil vedano solo i propri dati
  - Nessun utente possa accedere ai dati di altri

---

## 🌐 API da Implementare

### Consumer
- `GET /api/calendar/consumer`

### Vigil
- `GET /api/calendar/vigil/bookings`
- `POST /api/vigil/availability-rules`
- `GET /api/vigil/availability-rules`
- `DELETE /api/vigil/availability-rules/:id`
- `POST /api/vigil/unavailabilities`
- `GET /api/vigil/unavailabilities`

---

### Availability Engine (CORE LOGIC)
- `GET /api/vigil/:id/available-slots`
- Input:
  - date range
  - service_id
- Output:
  - slot orari prenotabili

---

## ⚙️ Availability Engine – Requisiti

Devi progettare e documentare un algoritmo che:

1. Espande le regole di disponibilità in slot orari
2. Filtra gli slot che intersecano:
   - prenotazioni
   - indisponibilità
3. Aggrega slot consecutivi se il servizio dura > 1 ora
4. Restituisce solo slot prenotabili

Fornisci:
- Pseudocodice dettagliato
- Eventuali query SQL critiche
- Note su performance e caching

---

## 🚀 Output Attesi dall’Agente

Devi produrre:

1. SQL completo delle tabelle
2. Indici consigliati
3. RLS policies Supabase
4. API contracts (request / response)
5. Pseudocodice Availability Engine
6. Eventuali suggerimenti architetturali
7. Best practices per scalabilità

---

## 🚫 Vincoli

- Nessuna logica di disponibilità sul frontend
- Tutta la business logic deve essere server-side
- API stateless
- Timezone gestita via UTC (documentare)

---

## 🧪 Definition of Done

La feature è completa quando:
- Consumer vede correttamente il proprio calendario
- Vigil gestisce disponibilità e assenze
- Nessuna prenotazione fuori slot disponibili è possibile
- Il sistema è sicuro via RLS
- Il design è estendibile (buffer, sync calendar, pricing)

---

**Agisci ora come AI Agent e inizia l’implementazione.**
