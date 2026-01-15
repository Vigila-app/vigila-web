# Multi-Step Onboarding Flow Diagrams

## CONSUMER Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      CONSUMER ONBOARDING                         │
└─────────────────────────────────────────────────────────────────┘

Step 1: WELCOME
┌──────────────────────────────┐
│ Benvenuto su Vigila!         │
│                              │
│ Question:                    │
│ • Nome della persona cara    │
└──────────┬───────────────────┘
           │
           ▼
Step 2: AGE-INFO
┌──────────────────────────────┐
│ Informazioni                 │
│                              │
│ Questions:                   │
│ • Età della persona cara     │
│ • Data di nascita           │
└──────────┬───────────────────┘
           │
           ▼
Step 3: CONTACT-INFO
┌──────────────────────────────┐
│ Come possiamo contattare?    │
│                              │
│ Question:                    │
│ • Numero di telefono         │
└──────────┬───────────────────┘
           │
           ▼
Step 4: RELATIONSHIP
┌──────────────────────────────┐
│ Che rapporto hai?            │
│                              │
│ Options:                     │
│ • Figlio/a                   │
│ • Nipote                     │
│ • Parente                    │
│ • Amico/a                    │
│ • Badante ──────────┐        │
└──────────┬──────────┼────────┘
           │          │
           │          ▼
           │    Step 4a: PROFESSIONAL-DETAILS
           │    ┌──────────────────────────────┐
           │    │ Dettagli professionali       │
           │    │                              │
           │    │ Question:                    │
           │    │ • Anni di esperienza         │
           │    └──────────┬───────────────────┘
           │               │
           └───────────────┘
                   │
                   ▼
Step 5: ADDRESS
┌──────────────────────────────┐
│ Dove abita?                  │
│                              │
│ Question:                    │
│ • Indirizzo (with search)    │
└──────────┬───────────────────┘
           │
           ▼
Step 6: ADDITIONAL-INFO
┌──────────────────────────────┐
│ Informazioni aggiuntive      │
│                              │
│ Question:                    │
│ • Raccontaci di più          │
│   (textarea)                 │
└──────────┬───────────────────┘
           │
           ▼
        [COMPLETE]
    Single API POST Call
```

## VIGIL Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        VIGIL ONBOARDING                          │
└─────────────────────────────────────────────────────────────────┘

Step 1: WELCOME
┌──────────────────────────────┐
│ Benvenuto su Vigila!         │
│                              │
│ Question:                    │
│ • Data di nascita            │
└──────────┬───────────────────┘
           │
           ▼
Step 2: CONTACT
┌──────────────────────────────┐
│ Informazioni di contatto     │
│                              │
│ Question:                    │
│ • Numero di telefono         │
└──────────┬───────────────────┘
           │
           ▼
Step 3: OCCUPATION
┌──────────────────────────────┐
│ La tua occupazione           │
│                              │
│ Options:                     │
│ • OSA ──────────────┐        │
│ • OSS ──────────────┤        │
│ • NURSE ────────────┤        │
│ • Other occupations │        │
└──────────┬──────────┼────────┘
           │          │
           │          ▼
           │    Step 3a: PROFESSIONAL-DOCS-INFO
           │    ┌──────────────────────────────┐
           │    │ Documentazione richiesta     │
           │    │                              │
           │    │ Checkbox:                    │
           │    │ • Comprendo che dovrò        │
           │    │   inviare documentazione     │
           │    └──────────┬───────────────────┘
           │               │
           └───────────────┘
                   │
                   ▼
Step 4: EXPERIENCE
┌──────────────────────────────┐
│ La tua esperienza            │
│                              │
│ Question:                    │
│ • Esperienza e competenze    │
│   (textarea)                 │
└──────────┬───────────────────┘
           │
           ▼
Step 5: TRANSPORTATION
┌──────────────────────────────┐
│ Come ti sposti?              │
│                              │
│ Options:                     │
│ • Auto ──────────┐           │
│ • Moto ──────────┤           │
│ • Bicicletta     │           │
│ • Trasporto      │           │
│   pubblico       │           │
└──────────┬───────┼───────────┘
           │       │
           │       └──────────────────┐
           │                          │
           ▼                          ▼
     Step 6a:                   Step 6b:
     SERVICE-AREA-LOCAL         SERVICE-AREA-WIDE
┌──────────────────────┐  ┌──────────────────────┐
│ Area di servizio     │  │ Area di servizio     │
│ (locale)             │  │ (ampia)              │
│                      │  │                      │
│ Options:             │  │ Options:             │
│ • Nel mio quartiere  │  │ • Zona vicino a me   │
│ • In tutta città     │  │ • Più zone città     │
│                      │  │ • Tutta provincia    │
└──────────┬───────────┘  └──────────┬───────────┘
           │                         │
           └─────────────┬───────────┘
                         │
                         ▼
Step 7: ADDRESS
┌──────────────────────────────┐
│ Dove offri i tuoi servizi?   │
│                              │
│ Question:                    │
│ • Area operativa             │
│   (address search)           │
└──────────┬───────────────────┘
           │
           ▼
        [COMPLETE]
    Single API POST Call
```

## Conditional Logic Patterns

### Question-Level Routing
```typescript
// Example: Relationship question routes to different steps
{
  id: "relationship",
  nextStep: (answer, allAnswers) => {
    if (answer === "Badante") {
      return "professional-details";  // Extra step for professional caregivers
    }
    return "address";  // Skip directly to address for others
  }
}
```

### Step-Level Routing
```typescript
// Example: Transportation step routes based on multiple questions
{
  id: "transportation",
  nextStep: (answers) => {
    const hasVehicle = answers.transportation === "auto" || 
                       answers.transportation === "moto";
    return hasVehicle ? "service-area-wide" : "service-area-local";
  }
}
```

## Progress Tracking

Each flow shows progress as percentage:
```
[████████░░░░░░░░░░] 40% - Passo 3 di 7
```

Progress calculation:
```typescript
const progress = ((currentStepIndex + 1) / totalSteps) * 100;
```

Note: Conditional steps may affect total, so progress is estimated based on all possible steps.

## Navigation

### Forward Navigation
- Click "Avanti" button
- Validates current step questions
- Determines next step (static or conditional)
- Updates progress
- Renders next step

### Back Navigation
- Click "Indietro" button
- Returns to previous visited step
- Preserves all answers
- Updates progress
- No validation required

### Completion
- Last step has no nextStep defined
- Button shows "Completa" instead of "Avanti"
- All answers collected
- Single POST request sent
- User redirected on success

## Data Flow

```
User Input
    ↓
Question Renderer
    ↓
Form State (react-hook-form)
    ↓
Flow State (MultiStepOnboarding)
    ↓
Answers Collection { question1: value1, question2: value2, ... }
    ↓
Transform Data (wrapper component)
    ↓
OnboardService.update()
    ↓
API POST /api/v1/onboard/[userId]/[role]
    ↓
Database Update
    ↓
Success Redirect
```

## Key Components Interaction

```
┌──────────────────────────────────────────────────────┐
│              Page (onboard-v2/page.tsx)              │
│                                                       │
│  ┌────────────────────────────────────────────────┐ │
│  │   ConsumerMultiStepOnboarding.tsx              │ │
│  │   (handles API integration)                    │ │
│  │                                                 │ │
│  │  ┌──────────────────────────────────────────┐ │ │
│  │  │  MultiStepOnboarding.tsx                 │ │ │
│  │  │  (manages flow & state)                  │ │ │
│  │  │                                          │ │ │
│  │  │  ┌────────────────────────────────────┐ │ │ │
│  │  │  │  QuestionRenderer.tsx             │ │ │ │
│  │  │  │  (renders individual questions)   │ │ │ │
│  │  │  │                                    │ │ │ │
│  │  │  │  Uses:                             │ │ │ │
│  │  │  │  • Input                           │ │ │ │
│  │  │  │  • TextArea                        │ │ │ │
│  │  │  │  • Checkbox                        │ │ │ │
│  │  │  │  • Select                          │ │ │ │
│  │  │  │  • SearchAddress                   │ │ │ │
│  │  │  └────────────────────────────────────┘ │ │ │
│  │  └──────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
                        │
                        ▼
              Configuration File
       (consumerOnboardingConfig.ts)
              Defines:
              • Steps
              • Questions
              • Validation
              • Conditional logic
```

## Error Handling

### Validation Errors
```
┌──────────────────────────┐
│ Nome della persona cara* │
│ [                      ] │ ← User leaves empty
│ Campo obbligatorio       │ ← Error shown
└──────────────────────────┘
```

### API Errors
```
┌──────────────────────────────────────┐
│ ⚠️  Si è verificato un errore        │
│ Riprova o contatta il supporto       │
└──────────────────────────────────────┘
```

### Loading States
```
┌──────────────────────────┐
│ [Completa] → [⚙️ Loading] │
└──────────────────────────┘
```

## Styling

### Role-Based Colors
- **Consumer**: Blue theme (`consumer-blue`)
- **Vigil**: Orange theme (`vigil-orange`)

Applied to:
- Progress bar
- Buttons
- Form field focus states
- Labels
- Links

### Responsive Design
- Mobile: Full width, single column
- Tablet: Centered, max-width container
- Desktop: Centered, comfortable reading width
