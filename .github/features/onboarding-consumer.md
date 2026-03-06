# Consumer Onboarding Flow

> **Purpose**: Complete specification for the CONSUMER onboarding flow, from functional requirements to technical implementation. For families seeking care for a loved one.

## Quick Reference

**Configuration**: [components/onboarding/multiStep/consumerOnboardingConfig.ts](../../components/onboarding/multiStep/consumerOnboardingConfig.ts)  
**Wrapper**: [components/onboarding/consumer/ConsumerMultiStepOnboarding.tsx](../../components/onboarding/consumer/ConsumerMultiStepOnboarding.tsx)  
**Page**: [app/(consumer)/onboard/page.tsx](../../app/(consumer)/onboard/page.tsx)  
**Routes**: `/onboard`  
**Steps**: 11 linear steps, no conditional branching

---

## Table of Contents
- [Requisiti Funzionali](#requisiti-funzionali)
- [Architettura Implementativa](#architettura-implementativa)
- [Sequenza Step](#sequenza-step)
- [Mappatura Dati](#mappatura-dati)
- [Testing](#testing)

---

## Functional Requirements

### Objective
Raccogliere informazioni sulla persona che necessita assistenza e le preferenze per il caregiver ideale, per facilitare il matching con i vigil disponibili.

### User Flow
1. **Identificazione**: Chi ha bisogno di assistenza (me stesso, genitore, nonno, etc.)
2. **Anagrafica**: Nome e data di nascita della persona cara
3. **Localizzazione**: Indirizzo dove avverrà l'assistenza
4. **Valutazione Autonomia**: Livello di autosufficienza (completa/parziale/assente)
5. **Bisogni Primari**: Tipologie di assistenza necessarie (multiple selection)
6. **Gender Preference**: Preference for caregiver's gender
7. **Desired Character**: Preferred character traits in caregiver
8. **Required Qualifications**: Need for OSS or family assistant qualification
9. **Transportation**: Requirement for caregiver to have transportation
10. **Specific Experience**: Request for experience with dementia/Alzheimer's
11. **Additional Notes**: Free text field for extra information

### User Stories
- **As a family member**, I want to describe who needs care to receive personalized proposals
- **As a family member**, I want to specify preferences for the caregiver to find the most suitable person
- **As a family member**, I want to provide situation details to facilitate service organization

### Non-Functional Requirements
- ✅ Linear flow without branching (simple user experience)
- ✅ Real-time validation to reduce errors
- ✅ Ability to go back and modify answers
- ✅ Data saved once completed (single API call)
- ✅ Redirect to confirmation page upon completion

---

## Implementation Architecture

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Form Management**: React Hook Form
- **Validation**: Zod schema + custom validators
- **State Management**: Zustand (user store)
- **UI Components**: Custom components + Heroicons
- **Type Safety**: Full TypeScript

### Architectural Pattern
```
Page Component
    ↓
ConsumerMultiStepOnboarding (wrapper)
    ↓
createConsumerOnboardingConfig() (config factory)
    ↓
MultiStepOnboarding (orchestrator - generic)
    ↓
QuestionRenderer (question-specific rendering)
```

### File Structure
```
components/onboarding/
├── multiStep/
│   ├── MultiStepOnboarding.tsx          # Generic orchestrator
│   ├── QuestionRenderer.tsx             # Question renderer
│   └── consumerOnboardingConfig.ts      # Consumer config
├── consumer/
│   └── ConsumerMultiStepOnboarding.tsx  # Consumer wrapper
└── @core/
    └── form/                             # Reusable form components

app/(consumer)/
└── onboard/
    └── page.tsx                          # Entry point
```

---

## Sequenza Step

### Flusso Completo (11 Steps)

1. **RELATIONSHIP** → 2. **NAME-BIRTHDAY** → 3. **ADDRESS** → 4. **AUTONOMY** → 5. **NEEDS** → 6. **GENDER_PREFERENCE** → 7. **ATTITUDE** → 8. **QUALIFICATIONS** → 9. **TRANSPORTATION** → 10. **EXPERIENCE** → 11. **INFO** → **COMPLETE**

**Caratteristiche**:
- Flusso completamente lineare
- Nessuna ramificazione condizionale
- Tutti gli utenti completano gli stessi 11 step
- Progress bar mostra "Step X di 11"

---

## Implemented Steps Detail

### Step 1: RELATIONSHIP

**Purpose**: Identify who needs care

```typescript
{
  id: "relationship",
  title: "Benvenuto su vigila!",
  description: "Iniziamo a conoscere chi ha bisogno di assistenza!",
  questions: [{
    id: "relationship",
    type: QuestionType.CARD,
    options: [
      { label: "Me stesso/a", value: "Me stesso/a", icon: UserIcon },
      { label: "Mamma/Papà", value: "Mamma/Papà", icon: HeartIcon },
      { label: "Nonna/Nonno", value: "Nonna/Nonno", icon: UsersIcon },
      { label: "Parente", value: "Parente", icon: UsersIcon },
      { label: "Amico", value: "Amico", icon: HeartIcon }
    ],
    validation: { required: true }
  }],
  nextStep: "name-birthday"
}
```

---

### Step 2: NAME-BIRTHDAY

**Purpose**: Collect loved one's name and birthday

```typescript
{
  id: "name-birthday",
  title: "Presenta la tua persona cara",
  description: "Come si chiama e quando è nato/a?",
  questions: [
    {
      id: "lovedOneName",
      type: QuestionType.TEXT,
      label: "Nome della persona cara",
      placeholder: "Es. Giovanni Bianchi",
      validation: { required: true, ...FormFieldType.NAME }
    },
    {
      id: "birthday",
      type: QuestionType.DATE,
      label: "La sua data di nascita",
      validation: {
        required: true,
        min: "current_year - 80",
        max: "current_year - 18"
      }
    }
  ],
  nextStep: "address"
}
```

---

### Step 3: ADDRESS

**Purpose**: Where care will be provided

```typescript
{
  id: "address",
  title: "Dove avverrà l'assistenza?",
  description: "L'indirizzo ci aiuterà a trovare i vigil intorno a te.",
  questions: [{
    id: "address",
    type: QuestionType.ADDRESS,
    label: "Indirizzo della persona cara",
    placeholder: "Inserisci la città e il CAP",
    validation: { required: true }
  }],
  nextStep: "autonomy"
}
```

---

### Step 4: AUTONOMY

**Purpose**: Assess independence level

```typescript
{
  id: "autonomy",
  title: "Quanto è autonomo/a nella vita quotidiana?",
  questions: [{
    id: "autonomy",
    type: QuestionType.CARD,
    options: [
      {
        label: "Autosufficiente",
        value: "Autosufficiente",
        description: "È completamente autonoma nella vita quotidiana."
      },
      {
        label: "Parzialmente autosufficiente",
        value: "Parzialmente autosufficiente",
        description: "Ha bisogno di aiuto in alcune attività quotidiane."
      },
      {
        label: "Non autosufficiente",
        value: "Non autosufficiente",
        description: "Necessita d'assistenza continua."
      }
    ],
    validation: { required: true }
  }],
  nextStep: "needs"
}
```

---

### Step 5: NEEDS

**Purpose**: Identify specific care needs

```typescript
{
  id: "needs",
  title: "Quali sono i bisogni principali?",
  description: "Puoi selezionare più opzioni.",
  questions: [{
    id: "needs",
    type: QuestionType.MULTI_CHECKBOX,
    options: Object.values(ConsumerNeedsEnum).map(...),
    validation: { required: true }
  }],
  nextStep: "gender_preference"
}
```

---

### Step 6: GENDER_PREFERENCE

**Purpose**: Caregiver gender preference

```typescript
{
  id: "gender_preference",
  title: "Hai una preferenza sul genere del vigil?",
  questions: [{
    id: "gender_preference",
    type: QuestionType.CARD,
    options: [
      { label: "Donna", value: "Donna", icon: Woman },
      { label: "Uomo", value: "Uomo", icon: Man },
      { label: "Indifferente", value: "Indifferente", icon: Couple }
    ],
    validation: { required: true }
  }],
  nextStep: "attitude"
}
```

---

### Step 7: ATTITUDE

**Purpose**: Desired personality traits

```typescript
{
  id: "attitude",
  title: "Che tipo di attitudine cerchi?",
  questions: [{
    id: "attitude",
    type: QuestionType.MULTI_CHECKBOX,
    options: [
      { label: "Molto paziente", value: "Molto paziente" },
      { label: "Tranquillo/a e riservato/a", value: "Tranquillo/a e riservato/a" },
      { label: "Molto organizzato/a", value: "Molto organizzato/a" },
      { label: "Flessibile con gli orari", value: "Flessibile con gli orari" },
      { label: "Molto puntuale", value: "Molto puntuale" }
    ],
    validation: { required: true }
  }],
  nextStep: "qualifications"
}
```

---

### Step 8: QUALIFICATIONS

**Purpose**: Professional qualification requirements

```typescript
{
  id: "qualifications",
  title: "È necessaria una qualifica OSS?",
  questions: [{
    id: "qualifications",
    type: QuestionType.CARD,
    options: [
      {
        label: "Sì, OSS qualificato",
        value: "OSS",
        description: "Operatore Socio Sanitario qualificato"
      },
      {
        label: "Assistente familiare (no qualfica)",
        value: "no OSS"
      },
      {
        label: "Nessuna preferenza",
        value: "Indifferente"
      }
    ],
    validation: { required: true }
  }],
  nextStep: "transportation"
}
```

---

### Step 9: TRANSPORTATION

**Purpose**: Vehicle requirement

```typescript
{
  id: "transportation",
  title: "È necessario che sia automunito",
  questions: [{
    id: "transportation",
    type: QuestionType.CARD,
    options: [
      { label: "Sì, automunito", value: "auto" },
      { label: "No, non necessario", value: "no auto" },
      { label: "Nessuna preferenza", value: "Indifferente" }
    ],
    validation: { required: true }
  }],
  nextStep: "experience"
}
```

---

### Step 10: EXPERIENCE

**Purpose**: Dementia/Alzheimer's experience requirement

```typescript
{
  id: "experience",
  title: "È necessaria esperienza con demenza/Alzheimer?",
  questions: [{
    id: "experience",
    type: QuestionType.CARD,
    options: [
      { label: "Sì, esperienza necessaria", value: "dementia" },
      { label: "No, non necessario", value: "no experience" },
      { label: "Nessuna preferenza", value: "Indifferente" }
    ],
    validation: { required: true }
  }],
  nextStep: "info"
}
```

---

### Step 11: INFO

**Purpose**: Additional free-form information

```typescript
{
  id: "info",
  title: "Informazioni aggiuntive",
  description: "Abbiamo quasi finito: se vuoi, aggiungi qualche dettaglio in più",
  questions: [{
    id: "information",
    type: QuestionType.TEXTAREA,
    placeholder: "Dicci tutto quello che può esserci utile sapere...",
    validation: { required: false }
  }]
  // No nextStep = completion
}
```

---

## Flow Diagram

```
CONSUMER ONBOARDING (11 LINEAR STEPS)

1. RELATIONSHIP → 2. NAME-BIRTHDAY → 3. ADDRESS → 4. AUTONOMY → 5. NEEDS
     ↓                   ↓                ↓            ↓             ↓
  Card choice      Name + Birthday    Address      Autonomy    Care needs
                    (18-80 years)     (search)      level      (multiple)

6. GENDER → 7. ATTITUDE → 8. QUALIFICATIONS → 9. TRANSPORTATION → 10. EXPERIENCE
     ↓           ↓                ↓                     ↓                  ↓
  M/F/Any   Personality    OSS/Assistente/Any      Car/No/Any      Dementia/No/Any
           (multiple)

11. INFO → COMPLETE
     ↓
Additional info
  (optional)
```

---

## Data Mapping

### Wrapper Transformation

```typescript
// ConsumerMultiStepOnboarding.tsx
const handleComplete = async (data: Record<string, any>) => {
  const { lovedOneName, birthday, relationship, address, information } = data;

  // Extract CAP from address
  const cap =
    address?.address?.postcode ||
    address?.address?.postalCode ||
    address?.address?.cap ||
    "";

  // All fields passed through via spread
  const onboardData = {
    ...data,              // Includes all 11 step fields
    lovedOneName,
    birthday,
    relationship,
    address,
    cap,
    information
  };

  await OnboardService.update({
    role: RolesEnum.CONSUMER,
    data: onboardData
  });

  // Post-submission
  await AuthService.renewAuthentication();
  await getUserDetails(true);
  router.replace(Routes.onBoardVigilComplete.url);
};
```

### Field Mapping

| Step | Question ID | Type | Database Field |
|------|------------|------|----------------|
| 1 | `relationship` | CARD | `consumers.relationship` |
| 2 | `lovedOneName` | TEXT | `consumers.lovedOneName` |
| 2 | `birthday` | DATE | `consumers.birthday` |
| 3 | `address` | ADDRESS | `consumers.address` (JSONB) |
| 3 | (computed) | - | `consumers.cap` (extracted) |
| 4 | `autonomy` | CARD | `consumers.autonomy` |
| 5 | `needs` | MULTI_CHECKBOX | `consumers.needs` (array) |
| 6 | `gender_preference` | CARD | `consumers.gender_preference` |
| 7 | `attitude` | MULTI_CHECKBOX | `consumers.attitude` (array) |
| 8 | `qualifications` | CARD | `consumers.qualifications` |
| 9 | `transportation` | CARD | `consumers.transportation` |
| 10 | `experience` | CARD | `consumers.experience` |
| 11 | `information` | TEXTAREA | `consumers.information` |

**Note**: All fields are passed through via `...data` spread, so the entire collected object is sent to the API.

---

## Testing

### Piano di Test Funzionale

1. Select "Mamma/Papà" → Next
2. Enter "Maria Rossi", select birthday (1945-01-01) → Next
3. Search and select "Via Roma 1, 80100 Napoli" → Next
4. Select "Parzialmente autosufficiente" → Next
5. Check "Compagnia" and "Preparazione pasti" → Next
6. Select "Donna" → Next
7. Check "Molto paziente" and "Tranquillo/a" → Next
8. Select "Indifferente" → Next
9. Select "no auto" → Next
10. Select "Indifferente" → Next
11. Enter "Ama la musica classica" → Complete
12. Verify redirect to completion page
13. Check database for saved data

### Test Cases di Validazione

- [ ] Try empty required fields in each step
- [ ] Try birthday outside 18-80 range
- [ ] Try invalid name format
- [ ] Try advancing without selecting address
- [ ] Verify multi-checkbox allows multiple selections (steps 5, 7)
- [ ] Verify back button preserves all answers

---

