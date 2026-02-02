# Vigil Onboarding Flow

> **Purpose**: Complete specification for the VIGIL (caregiver) onboarding flow based on actual implementation. This flow collects caregiver profile, qualifications, services offered, and availability.

## Quick Reference

**Configuration**: [components/onboarding/multiStep/vigilOnboardingConfig.ts](../../components/onboarding/multiStep/vigilOnboardingConfig.ts)  
**Wrapper**: [components/onboarding/vigil/VigilMultiStepOnboarding.tsx](../../components/onboarding/vigil/VigilMultiStepOnboarding.tsx)  
**Page**: [app/vigil/onboard-v2/page.tsx](../../app/vigil/onboard-v2/page.tsx)  
**Routes**: New flow at `/vigil/onboard-v2`, old flow at `/vigil/onboard`  
**Total Steps**: 20 steps with 3 conditional branches

---

## Table of Contents
- [Overview](#overview)
- [Complete Step Sequence](#complete-step-sequence)
- [Conditional Logic](#conditional-logic)
- [Data Mapping](#data-mapping)
- [Testing Guide](#testing-guide)

---

## Overview

The vigil onboarding flow collects comprehensive information about caregivers including:
- Personal info (birthday, gender, address, zones)
- Transportation and occupation
- Training and experience
- Services offered (daily activities, hygiene, outdoor)
- Past experience and service type
- Availability and character traits
- Profile photo

**3 Conditional Branches**:
1. Professional occupation (OSA/OSS/NURSE) → documentation acknowledgment
2. Hygiene services "none" → filters to only "none"
3. Outdoor services "none" → filters to only "none"

---

## Complete Step Sequence

### Step 1: WELCOME

**Purpose**: Collect age and gender

```typescript
{
  id: "welcome",
  title: "Benvenuto su Vigila!",
  description: "Questi dati consentono di gestire al meglio preferenze ed abbinamenti.",
  questions: [
    {
      id: "birthday",
      type: QuestionType.DATE,
      label: "Data di nascita",
      validation: {
        required: true,
        min: "current_year - 80",
        max: "current_year - 18"
      }
    },
    {
      id: "gender",
      type: QuestionType.SELECT,
      label: "Genere",
      options: Object.values(GenderEnum).map(...)
    }
  ],
  nextStep: "address"
}
```

---

### Step 2: ADDRESS

**Purpose**: Residence address (not visible to families)

```typescript
{
  id: "address",
  title: "Qual è il tuo indirizzo di residenza?",
  description: "Questo indirizzo non sarà visibile alle famiglie.",
  questions: [{
    id: "addresses",
    type: QuestionType.MULTI_ADDRESS,
    placeholder: "Inserisci il CAP o città...",
    validation: { required: true }
  }],
  nextStep: "zones"
}
```

---

### Step 3: ZONES

**Purpose**: Work zones in Naples

```typescript
{
  id: "zones",
  title: "In quali zone sei disponibile a lavorare?",
  description: "Selezione tutte le zone di Napoli in cui puoi offrire i tuoi servizi",
  questions: [{
    id: "zones",
    type: QuestionType.MULTI_CHECKBOX,
    options: Object.values(VigilZoneEnum).map(...),
    validation: { required: true }
  }],
  nextStep: "transportation"
}
```

---

### Step 4: TRANSPORTATION

**Purpose**: Transportation method

```typescript
{
  id: "transportation",
  title: "Hai un mezzo di trasporto?",
  description: "Questo aiuta le famiglie a capire se puoi accompagnare fuori casa.",
  questions: [{
    id: "transportation_mode",
    type: QuestionType.RADIO,
    options: Object.values(VigilTransportationEnum).map(...),
    validation: { required: true }
  }],
  nextStep: "occupation"
}
```

---

### Step 5: OCCUPATION

**Purpose**: Professional role

```typescript
{
  id: "occupation",
  title: "Come descriveresti il tuo ruolo principale?",
  questions: [{
    id: "occupation",
    type: QuestionType.RADIO,
    options: Object.values(OccupationEnum).map(...),
    validation: { required: true }
  }],
  nextStep: (answers) => {
    const requiresDocs = [OccupationEnum.PROFESSIONAL, OccupationEnum.NURSE];
    if (requiresDocs.includes(answers.occupation)) {
      return "professional_docs_info";
    }
    return "courses";
  }
}
```

**Conditional**: Professional/Nurse → professional_docs_info, otherwise → courses

---

### Step 6: PROFESSIONAL_DOCS_INFO (Conditional)

**Purpose**: Documentation acknowledgment for professionals

```typescript
{
  id: "professional_docs_info",
  title: "Documentazione professionale",
  description: "Per l'occupazione selezionata è richiesta documentazione certificata",
  questions: [{
    id: "understandsDocRequirement",
    type: QuestionType.CHECKBOX,
    label: "Comprendo che dovrò inviare la documentazione...",
    validation: {
      required: true,
      validate: (value) => value === true || "Devi accettare per continuare"
    }
  }],
  nextStep: "courses"
}
```

**Shown only when**: Occupation is PROFESSIONAL or NURSE

---

### Step 7: COURSES

**Purpose**: Training and certifications

```typescript
{
  id: "courses",
  title: "Hai titoli o corsi di formazione?",
  description: "Es. OSS, corso assistente familiare... Lascia vuoto se non ne hai.",
  questions: [{
    id: "courses",
    type: QuestionType.TEXTAREA,
    placeholder: "Esempio: corso OSS conseguito nel 2020...",
    validation: { required: false, maxLength: 650 }
  }],
  nextStep: "years_of_experience"
}
```

---

### Step 8: YEARS_OF_EXPERIENCE

**Purpose**: Experience duration

```typescript
{
  id: "years_of_experience",
  title: "Da quanto anni lavori nell'assistenza?",
  questions: [{
    id: "experience_years",
    type: QuestionType.RADIO,
    options: Object.values(VigilExperienceYearsEnum).map(...),
    validation: { required: true }
  }],
  nextStep: "about"
}
```

---

### Step 9: ABOUT

**Purpose**: Bio for profile

```typescript
{
  id: "about",
  title: "Raccontaci brevemente la tua esperienza",
  description: "3-4 righe che appariranno sul tuo profilo. Massimo 400 caratteri.",
  questions: [{
    id: "bio",
    type: QuestionType.TEXTAREA,
    placeholder: "Ho lavorato per 5 anni come assistente familiare...",
    validation: { required: true, maxLength: 400 }
  }],
  nextStep: "daily_activities"
}
```

---

### Step 10: DAILY_ACTIVITIES

**Purpose**: Daily living assistance services

```typescript
{
  id: "daily_activities",
  title: "In cosa puoi aiutare nella vita quotidiana?",
  description: "Seleziona tutti i servizi che offri",
  questions: [{
    id: "services",
    type: QuestionType.MULTI_CHECKBOX,
    options: Object.values(VigilDailyServiceEnum).map(...),
    validation: { required: true }
  }],
  nextStep: "hygene"
}
```

---

### Step 11: HYGIENE

**Purpose**: Personal hygiene services

```typescript
{
  id: "hygene",
  title: "Ti occupi di igene personale?",
  description: "Seleziona tutto ciò in cui puoi aiutare",
  questions: [{
    id: "hygene_services",
    type: QuestionType.MULTI_CHECKBOX,
    options: Object.values(VigilHygieneServiceEnum).map(...),
    validation: { required: true }
  }],
  nextStep: (answers) => {
    // If "none" selected, filter to only "none"
    if (answers.services?.includes(VigilHygieneServiceEnum.NONE)) {
      answers.services = answers.services.filter(
        (s: string) => s == VigilHygieneServiceEnum.NONE
      );
    }
    return "outside";
  }
}
```

**Conditional Logic**: If "none" is selected, removes all other selections

---

### Step 12: OUTSIDE

**Purpose**: Outdoor accompaniment services

```typescript
{
  id: "outside",
  title: "Puoi accompagnare fuori casa?",
  description: "Seleziona le attività di accompagnamento che offri",
  questions: [{
    id: "outdoor_services",
    type: QuestionType.MULTI_CHECKBOX,
    options: Object.values(VigilOutdoorServiceEnum).map(...),
    validation: { required: true }
  }],
  nextStep: (answers) => {
    // If "none" selected, filter to only "none"
    if (answers.outside?.includes(VigilOutdoorServiceEnum.NONE)) {
      answers.outside = answers.outside.filter(
        (s: string) => s == VigilOutdoorServiceEnum.NONE
      );
    }
    return "past_exp";
  }
}
```

**Conditional Logic**: If "none" is selected, removes all other selections

---

### Step 13: PAST_EXP

**Purpose**: Experience with specific conditions

```typescript
{
  id: "past_exp",
  title: "Con quali situazioni hai già esperienza?",
  description: "Seleziona tutte le situazioni con cui hai familiarità",
  questions: [{
    id: "past_experience",
    type: QuestionType.MULTI_CHECKBOX,
    options: Object.values(VigilPastExperienceEnum).map(...),
    validation: { required: true }
  }],
  nextStep: "service_type"
}
```

---

### Step 14: SERVICE_TYPE

**Purpose**: Type of service offered

```typescript
{
  id: "service_type",
  title: "Che tipo di servizio offri?",
  description: "Puoi selezionare più opzioni",
  questions: [{
    id: "type",
    type: QuestionType.MULTI_CHECKBOX,
    options: Object.values(VigilServiceTypeEnum).map(...),
    validation: { required: true }
  }],
  nextStep: "hours"
}
```

---

### Step 15: HOURS

**Purpose**: Weekly time commitment

```typescript
{
  id: "hours",
  title: "Quante ore a settimana vorresti lavorare?",
  questions: [{
    id: "time_committment",
    type: QuestionType.RADIO,
    options: Object.values(VigilTimeCommitmentEnum).map(...),
    validation: { required: true }
  }],
  nextStep: "availabilities"
}
```

---

### Step 16: AVAILABILITIES

**Purpose**: Weekly schedule

```typescript
{
  id: "availabilities",
  title: "Qual è la tua disponibilità settimanale?",
  description: "Seleziona i giorni in cui sei disponibile e gli orari",
  questions: [{
    id: "availabilities",
    type: QuestionType.AVAILABILITIES,
    label: "Disponibilità",
    validation: { required: false }
  }],
  nextStep: "urgent"
}
```

---

### Step 17: URGENT

**Purpose**: Urgent request availability

```typescript
{
  id: "urgent",
  title: "Sei disponibile per richieste urgenti?",
  description: "Ultimo minuto o situazioni di emergenza",
  questions: [{
    id: "urgent_requests",
    type: QuestionType.CARD,
    options: [
      {
        label: "Si, sono disponibile",
        description: "Riceverai notifiche per richieste urgenti",
        icon: CheckCircleIcon,
        value: "yes"
      },
      {
        label: "No, preferisco programmare",
        description: "Riceverai solo richieste pianificate",
        icon: XCircleIcon,
        value: "no"
      }
    ]
  }],
  nextStep: "character"
}
```

---

### Step 18: CHARACTER

**Purpose**: Personality traits (max 3)

```typescript
{
  id: "character",
  title: "Come descriveresti il tuo carattere?",
  description: "Seleziona massimo 3 caratteristiche che ti rappresentano",
  questions: [{
    id: "character",
    type: QuestionType.MULTI_CHECKBOX,
    max: 3,
    options: Object.values(VigilCharacterTraitEnum).map(...),
    validation: { required: true }
  }],
  nextStep: "languages"
}
```

---

### Step 19: LANGUAGES

**Purpose**: Italian language confirmation

```typescript
{
  id: "languages",
  title: "Parli italiano fluentemente?",
  questions: [{
    id: "language_confirmation",
    type: QuestionType.CHECKBOX,
    label: "Confermo di saper parlare italiano fluentemente.",
    validation: {
      required: true,
      validate: (value) => value === true || "Devi confermare per continuare"
    }
  }],
  nextStep: "propic"
}
```

---

### Step 20: PROPIC

**Purpose**: Profile photo upload

```typescript
{
  id: "propic",
  title: "Aggiungi una foto profilo",
  description: "Una foto sorridente aiuta le famiglie a conoscerti meglio.",
  questions: [{
    id: "propic",
    type: QuestionType.FILE,
    validation: { required: true }
  }]
  // No nextStep = completion
}
```

---

## Conditional Logic

### 1. Occupation → Professional Docs

```typescript
nextStep: (answers) => {
  const requiresDocs = [OccupationEnum.PROFESSIONAL, OccupationEnum.NURSE];
  if (requiresDocs.includes(answers.occupation)) {
    return "professional_docs_info";
  }
  return "courses";
}
```

**Paths**:
- Professional/Nurse → step 6 (professional_docs_info) → step 7
- Other occupations → skip to step 7 (courses)

---

### 2. Hygiene Services "None" Filter

```typescript
nextStep: (answers) => {
  if (answers.services?.includes(VigilHygieneServiceEnum.NONE)) {
    answers.services = answers.services.filter(
      (s: string) => s == VigilHygieneServiceEnum.NONE
    );
  }
  return "outside";
}
```

**Logic**: If user selects "none", automatically deselects all other hygiene service options.

---

### 3. Outdoor Services "None" Filter

```typescript
nextStep: (answers) => {
  if (answers.outside?.includes(VigilOutdoorServiceEnum.NONE)) {
    answers.outside = answers.outside.filter(
      (s: string) => s == VigilOutdoorServiceEnum.NONE
    );
  }
  return "past_exp";
}
```

**Logic**: If user selects "none", automatically deselects all other outdoor service options.

---

## Data Mapping

### Wrapper Transformation

```typescript
// VigilMultiStepOnboarding.tsx
const handleComplete = async (data: Record<string, any>) => {
  const { address, propic } = data;

  // Extract postal code
  const cap = address?.address?.postcode || address?.address?.postalCode || "";

  // Prepare addresses array
  const addresses = address ? [address] : [];
  const caps = cap ? [cap] : [];

  // Prepare data for API
  const onboardData: any = {
    addresses,
    cap: caps,
    ...data
  };

  // Remove fields not stored in database
  delete onboardData.language_confirmation;
  delete onboardData.understandsDocRequirement;
  delete onboardData.availabilities;

  // Upload profile photo separately
  if (propic && user?.id) {
    await StorageUtils.uploadFile("profile-pics", propic, user.id, {
      contentType: propic.type || "image/png"
    });
  }
  delete onboardData.propic;

  await OnboardService.update({
    role: RolesEnum.VIGIL,
    data: onboardData
  });

  // Post-submission
  await AuthService.renewAuthentication();
  await getUserDetails(true);
  router.replace(Routes.onBoardVigilComplete.url);
};
```

### Fields Sent to API

| Question ID | Sent to API | Notes |
|------------|-------------|-------|
| `birthday` | ✅ Yes | - |
| `gender` | ✅ Yes | - |
| `addresses` | ✅ Yes | Wrapped in array |
| `zones` | ✅ Yes | - |
| `transportation_mode` | ✅ Yes | - |
| `occupation` | ✅ Yes | - |
| `understandsDocRequirement` | ❌ No | Deleted before API call |
| `courses` | ✅ Yes | - |
| `experience_years` | ✅ Yes | - |
| `bio` | ✅ Yes | - |
| `services` | ✅ Yes | - |
| `hygene_services` | ✅ Yes | - |
| `outdoor_services` | ✅ Yes | - |
| `past_experience` | ✅ Yes | - |
| `type` | ✅ Yes | - |
| `time_committment` | ✅ Yes | - |
| `availabilities` | ❌ No | Deleted before API call |
| `urgent_requests` | ✅ Yes | - |
| `character` | ✅ Yes | - |
| `language_confirmation` | ❌ No | Deleted before API call |
| `propic` | ❌ No | Uploaded separately to storage |

---

## Testing Guide

### Complete Test Path

1. Enter birthday (1985-06-20), select gender → Next
2. Search address "Via Roma 1, 80100 Napoli" → Next
3. Check zones "Centro", "Vomero" → Next
4. Select "Auto" → Next
5. Select "PROFESSIONAL" → Next (goes to step 6)
6. Check "Comprendo documentazione" → Next
7. Enter courses "OSS 2020" (optional) → Next
8. Select experience "5-10 anni" → Next
9. Enter bio (max 400 chars) → Next
10. Check daily services → Next
11. Check hygiene services (or "none") → Next
12. Check outdoor services (or "none") → Next
13. Check past experience → Next
14. Check service type → Next
15. Select time commitment → Next
16. Set availabilities (optional) → Next
17. Select urgent availability → Next
18. Select max 3 character traits → Next
19. Check Italian confirmation → Next
20. Upload profile photo → Complete
21. Verify redirect to completion page

### Conditional Path Tests

- [ ] Select "OTHER" occupation → verify skip to courses (no docs step)
- [ ] Select "PROFESSIONAL" → verify docs acknowledgment shown
- [ ] Select "NURSE" → verify docs acknowledgment shown
- [ ] Check "none" in hygiene → verify other selections removed
- [ ] Check "none" in outdoor → verify other selections removed

### Validation Tests

- [ ] Birthday outside 18-80 range
- [ ] Try advancing without required selections
- [ ] Try more than 3 character traits
- [ ] Try bio > 400 characters
- [ ] Try courses > 650 characters
- [ ] Try advancing without checking required checkboxes (docs, language)
- [ ] Try completing without uploading photo

---

For technical details, see [onboarding-system-reference.md](./onboarding-system-reference.md).  
For consumer flow, see [onboarding-consumer-flow.md](./onboarding-consumer-flow.md).  
For development guide, see [onboarding-guide.md](./onboarding-guide.md).
