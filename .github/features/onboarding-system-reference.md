# Multi-Step Onboarding System Reference

> **Purpose**: Complete technical reference for the Vigila multi-step onboarding system. Use this for understanding architecture, components, types, and integration points.

## Table of Contents
- [System Architecture](#system-architecture)
- [Core Components](#core-components)
- [Type System](#type-system)
- [Question Types](#question-types)
- [Data Flow](#data-flow)
- [Database Integration](#database-integration)
- [API Integration](#api-integration)
- [File Structure](#file-structure)

---

## System Architecture

### Overview
- **Tree-based onboarding flow** supporting both CONSUMER and VIGIL roles
- Each step contains 1+ questions; next step can be static or conditional
- All answers collected in a flat object, submitted via single API call on completion
- Built on React Hook Form for validation and state management
- Uses existing Vigila form components (Input, TextArea, Checkbox, Select, SearchAddress)

### Key Principles
1. **Configuration-driven**: Flows defined in config files, not hardcoded in components
2. **Conditional routing**: Next step determined by user answers (question-level or step-level)
3. **Single submission**: All data collected throughout flow, sent once at end
4. **Progressive migration**: New system coexists with old at separate routes
5. **Type-safe**: Full TypeScript coverage with comprehensive type definitions

---

## Core Components

### 1. MultiStepOnboarding (`components/onboarding/multiStep/MultiStepOnboarding.tsx`)
**Main orchestrator component** - 286 lines

**Responsibilities**:
- Manages flow state (current step, visited steps, answers)
- Controls navigation (forward/backward)
- Validates current step before progression
- Tracks progress and displays progress bar
- Collects all answers and invokes `onComplete` callback
- Handles loading and error states

**Key Methods**:
```typescript
// Validates current step, determines next step, updates state
handleNext(): void

// Returns to previous visited step
handleBack(): void

// Calculates next step ID using step-level or question-level routing
getNextStepId(step: OnboardingStep, answers: Record<string, any>): string | null

// Triggers validation for current step's questions
trigger(questionIds: string[]): Promise<boolean>
```

**State Management**:
```typescript
interface OnboardingFlowState {
  currentStepId: string;           // Current step being displayed
  answers: Record<string, any>;    // All collected answers (flat object)
  visitedSteps: string[];          // Stack of visited step IDs (for back navigation)
  isLoading: boolean;              // Submission in progress
  error?: string;                  // Error message if any
}
```

### 2. QuestionRenderer (`components/onboarding/multiStep/QuestionRenderer.tsx`)
**Universal question renderer** - 240 lines

**Responsibilities**:
- Renders individual questions based on `QuestionType`
- Integrates with React Hook Form via `Controller`
- Applies validation rules
- Displays error messages
- Handles type-specific UI (placeholders, icons, etc.)

**Supported Input Components**:
- `Input`: TEXT, EMAIL, PHONE
- `NumericInput`: NUMBER
- `DateInput`: DATE
- `TextArea`: TEXTAREA
- `Select`: SELECT
- `RadioInput`: RADIO
- `CheckboxInput`: CHECKBOX, MULTI_CHECKBOX
- `SearchAddress`: ADDRESS
- `FileInput`: FILE
- `SelectMultiInput`: SELECT_MULTI
- `AvailabilitiesInput`: AVAILABILITIES

### 3. Configuration Files

#### consumerOnboardingConfig.ts (`components/onboarding/multiStep/consumerOnboardingConfig.ts`)
Defines CONSUMER flow - 169 lines

**Steps**: welcome → age-info → contact-info → relationship → [conditional: professional-details] → address → additional-info

**Conditional Logic**:
- Users selecting "Badante" as relationship get additional `professional-details` step asking for years of experience

#### vigilOnboardingConfig.ts (`components/onboarding/multiStep/vigilOnboardingConfig.ts`)
Defines VIGIL flow - 220 lines

**Steps**: welcome → contact → occupation → [conditional: professional-docs-info] → experience → transportation → [conditional: service-area-wide/local] → address

**Conditional Logic**:
1. Professional occupations (OSA, OSS, NURSE) trigger `professional-docs-info` step
2. Users with car/moto get `service-area-wide` options vs. bike/public transport users get `service-area-local`

### 4. Wrapper Components

#### ConsumerMultiStepOnboarding.tsx (`components/onboarding/consumer/ConsumerMultiStepOnboarding.tsx`)
- Wrapper for Consumer onboarding - 91 lines
- Creates consumer config with `onComplete` handler
- Transforms flat answers into API payload
- Handles authentication renewal and navigation after submission

#### VigilMultiStepOnboarding.tsx (`components/onboarding/vigil/VigilMultiStepOnboarding.tsx`)
- Wrapper for Vigil onboarding - 93 lines
- Creates vigil config with `onComplete` handler
- Extracts postal code from address object
- Handles authentication renewal and navigation after submission

---

## Type System

### Core Types (`src/types/multiStepOnboard.types.ts`)

#### QuestionType (Enum)
```typescript
enum QuestionType {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  DATE = "DATE",
  EMAIL = "EMAIL",
  PHONE = "PHONE",
  TEXTAREA = "TEXTAREA",
  SELECT = "SELECT",
  SELECT_MULTI = "SELECT_MULTI",
  RADIO = "RADIO",
  CHECKBOX = "CHECKBOX",
  MULTI_CHECKBOX = "MULTI_CHECKBOX",
  ADDRESS = "ADDRESS",
  MULTI_ADDRESS = "MULTI_ADDRESS",
  FILE = "FILE",
  CARD = "CARD",
  AVAILABILITIES = "AVAILABILITIES"
}
```

#### ValidationRules
```typescript
interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number | string;  // For numbers or dates
  max?: number | string;  // For numbers or dates
  pattern?: RegExp;
  validate?: (value: any) => boolean | string;
  file?: {
    maxSize: number;        // Bytes (default: 5MB)
    allowedMimes: string[]; // e.g., ["image/jpeg", "image/png"]
  };
}
```

#### OnboardingQuestion
```typescript
interface OnboardingQuestion {
  id: string;                           // MUST match Supabase column name
  type: QuestionType;
  label: string;
  placeholder?: string;
  options?: Array<{
    label: string;
    value: string;
    icon?: React.ComponentType;
  }>;
  validation?: ValidationRules;
  autoFocus?: boolean;
  defaultValue?: any;
  // Conditional routing at question level (takes precedence over step-level)
  nextStep?: string | ((answer: any, allAnswers: Record<string, any>) => string | null);
}
```

#### OnboardingStep
```typescript
interface OnboardingStep {
  id: string;
  title: string;
  description?: string;
  questions: OnboardingQuestion[];
  // Conditional routing at step level
  nextStep?: string | ((answers: Record<string, any>) => string | null);
}
```

#### OnboardingFlowConfig
```typescript
interface OnboardingFlowConfig {
  role: RolesEnum;                     // CONSUMER or VIGIL
  initialStepId: string;               // First step to display
  steps: OnboardingStep[];             // All steps in flow
  onComplete: (data: Record<string, any>) => Promise<void>;  // Called when flow completes
}
```

---

## Question Types

### Text-Like Inputs

#### TEXT
Basic text input
```typescript
{
  id: "lovedOneName",
  type: QuestionType.TEXT,
  label: "Nome della persona cara",
  validation: { required: true, maxLength: 100 }
}
```

#### EMAIL
Email input with validation
```typescript
{
  id: "email",
  type: QuestionType.EMAIL,
  label: "Indirizzo email",
  validation: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
}
```

#### PHONE
Phone number input
```typescript
{
  id: "phone",
  type: QuestionType.PHONE,
  label: "Numero di telefono",
  validation: { required: true, pattern: /^[0-9]{10}$/ }
}
```

### Numeric and Date Inputs

#### NUMBER
Numeric input with min/max
```typescript
{
  id: "age",
  type: QuestionType.NUMBER,
  label: "Età",
  validation: { required: true, min: 0, max: 120 }
}
```

#### DATE
Date picker
```typescript
{
  id: "birthday",
  type: QuestionType.DATE,
  label: "Data di nascita",
  validation: { required: true, min: "1920-01-01", max: "2008-01-01" }
}
```

### Long-Form Text

#### TEXTAREA
Multi-line text area
```typescript
{
  id: "information",
  type: QuestionType.TEXTAREA,
  label: "Raccontaci di più",
  placeholder: "Descrivi le esigenze...",
  validation: { maxLength: 650 }
}
```

### Selection Inputs

#### SELECT
Single-select dropdown
```typescript
{
  id: "occupation",
  type: QuestionType.SELECT,
  label: "Occupazione",
  options: [
    { label: "OSA", value: "OSA" },
    { label: "OSS", value: "OSS" }
  ],
  validation: { required: true }
}
```

#### SELECT_MULTI
Multi-select dropdown with search and icons
```typescript
{
  id: "languages",
  type: QuestionType.SELECT_MULTI,
  label: "Lingue parlate",
  options: [
    { label: "Italiano", value: "italian", icon: ItalianFlagIcon },
    { label: "Inglese", value: "english", icon: EnglishFlagIcon }
  ],
  validation: { required: true }
}
```

#### RADIO
Single choice from options
```typescript
{
  id: "relationship",
  type: QuestionType.RADIO,
  label: "Che rapporto hai con la persona cara?",
  options: [
    { label: "Figlio/a", value: "child" },
    { label: "Badante", value: "caregiver" }
  ],
  validation: { required: true }
}
```

### Multiple Choice

#### CHECKBOX
Single boolean checkbox
```typescript
{
  id: "understandsDocRequirement",
  type: QuestionType.CHECKBOX,
  label: "Ho capito che devo fornire documentazione",
  validation: { required: true }
}
```

#### MULTI_CHECKBOX
Multiple checkbox selections
```typescript
{
  id: "services",
  type: QuestionType.MULTI_CHECKBOX,
  label: "Quali servizi offri?",
  options: [
    { label: "Assistenza personale", value: "personal" },
    { label: "Compagnia", value: "companionship" },
    { label: "Nessuno", value: "none" }
  ],
  validation: { required: true, max: 3 }  // Max 3 selections
}
```

### Special Inputs

#### ADDRESS
Address search with autocomplete
```typescript
{
  id: "address",
  type: QuestionType.ADDRESS,
  label: "Dove abita?",
  validation: { required: true }
}
```
Returns object:
```typescript
{
  address: {
    postcode: string,
    postalCode: string,
    city: string,
    country: string,
    // ... more fields
  },
  display_name: string
}
```

#### FILE
File upload with validation
```typescript
{
  id: "photo",
  type: QuestionType.FILE,
  label: "Upload Profile Picture",
  placeholder: "Max 5MB - JPG or PNG only",
  validation: {
    required: true,
    file: {
      maxSize: 5 * 1024 * 1024,
      allowedMimes: ["image/jpeg", "image/png"]
    }
  }
}
```
Features:
- Shows file name and remove button
- Image preview in circular frame
- Error messages for size/type violations

#### AVAILABILITIES
Weekly schedule with toggles and time ranges
```typescript
{
  id: "availabilities",
  type: QuestionType.AVAILABILITIES,
  label: "Quando sei disponibile?",
  validation: { required: false }
}
```

---

## Data Flow

### 1. Configuration Phase
```
createConsumerOnboardingConfig() or createVigilOnboardingConfig()
    ↓
Returns OnboardingFlowConfig {
  role: RolesEnum.CONSUMER | RolesEnum.VIGIL,
  initialStepId: "welcome",
  steps: [...],
  onComplete: async (data) => { ... }
}
```

### 2. User Input Phase
```
MultiStepOnboarding Component
    ↓
Renders current step questions
    ↓
QuestionRenderer for each question
    ↓
React Hook Form Controller captures value
    ↓
Value stored in form state
```

### 3. Navigation Phase
```
User clicks "Avanti" (Next)
    ↓
handleNext() invoked
    ↓
Validate current step: trigger(questionIds)
    ↓
If invalid: Display errors, stay on step
    ↓
If valid: getNextStepId(step, answers)
    ↓
Update state: answers, currentStepId, visitedSteps
    ↓
Re-render with new step
```

### 4. Completion Phase
```
Last step completed (no nextStep)
    ↓
handleNext() detects completion
    ↓
onComplete(answers) callback invoked
    ↓
Wrapper transforms flat answers to API payload
    ↓
OnboardService.update({ role, data })
    ↓
API POST /api/v1/onboard/[userId]/[role]
    ↓
Database update (consumers, vigils, consumers-data, vigils-data tables)
    ↓
AuthService.renewAuthentication()
    ↓
useUserStore.getUserDetails()
    ↓
Router redirect to home
```

### Conditional Routing Logic

#### Question-Level Routing (Higher Priority)
```typescript
{
  id: "relationship",
  type: QuestionType.RADIO,
  options: [...],
  nextStep: (answer, allAnswers) => {
    if (answer === "caregiver") return "professional-details";
    return null; // Use step-level routing
  }
}
```

#### Step-Level Routing
```typescript
{
  id: "transportation",
  questions: [...],
  nextStep: (answers) => {
    const hasVehicle = ["auto", "moto"].includes(answers.transportation);
    return hasVehicle ? "service-area-wide" : "service-area-local";
  }
}
```

---

## Database Integration

### Tables Involved

#### `consumers` table
Primary consumer profile information
- `displayName`: User's name
- `lovedOneName`: Name of person being cared for
- `lovedOneAge`: Age of loved one
- `lovedOneBirthday`: Birthday of loved one
- `phone`: Contact phone number
- `addresses`: JSONB address object(s)
- `cap`: Postal code extracted from address
- `information`: Additional notes

#### `consumers-data` table
Extended consumer information
- **Foreign Key**: `consumer_id` → `consumers.id`
- `autonomy`: Loved one's autonomy level
- `healthConditions`: Medical conditions
- `mobility`: Mobility level
- `dietaryRestrictions`: Dietary needs
- `medication`: Medication info
- `experience`: Required caregiver experience level

#### `vigils` table
Primary vigil (caregiver) profile
- `birthday`: Vigil's date of birth
- `phone`: Contact phone number
- `occupation`: Professional occupation
- `information`: Experience and competencies
- `transportation`: Transportation method
- `addresses`: JSONB address object(s)
- `cap`: Postal code
- `understandsDocRequirement`: Boolean flag for professional documentation
- `wideAreaCoverage`: Boolean flag for service area

#### `vigils-data` table
Extended vigil information
- **Foreign Key**: `vigil_id` → `vigils.id`
- Additional fields for services, specializations, etc.

### ID Contract
**CRITICAL**: Each `question.id` MUST match the Supabase column name where the value is stored.

Example mapping:
- `lovedOneName` → `consumers.lovedOneName`
- `birthday` → `vigils.birthday`
- `understandsDocRequirement` → `vigils.understandsDocRequirement`

---

## API Integration

### Submission Endpoint
```
POST /api/v1/onboard/[userId]/[role]
```

### OnboardService.update()
Located in `src/services/onboard.service.ts`

```typescript
interface UpdateParams {
  role: RolesEnum.CONSUMER | RolesEnum.VIGIL;
  data: Record<string, any>;
}

// Usage in wrapper component
await OnboardService.update({
  role: RolesEnum.CONSUMER,
  data: {
    displayName: answers.name,
    lovedOneName: answers.lovedOneName,
    lovedOneAge: answers.age,
    phone: answers.phone,
    addresses: [answers.address],
    cap: extractedPostalCode,
    information: answers.information
  }
});
```

### Address Handling
Special extraction logic for postal code:
```typescript
const cap = 
  address?.address?.postcode || 
  address?.address?.postalCode || 
  address?.address?.postal_code ||
  address?.address?.postalcode ||
  "";
```

---

## File Structure

```
components/onboarding/multiStep/
├── MultiStepOnboarding.tsx            # Main orchestrator
├── QuestionRenderer.tsx               # Question renderer
├── consumerOnboardingConfig.ts        # Consumer flow definition
├── vigilOnboardingConfig.ts           # Vigil flow definition
├── index.ts                           # Exports
└── README.md                          # Component documentation

components/onboarding/consumer/
├── ConsumerMultiStepOnboarding.tsx    # Consumer wrapper
└── onboardComponent_Consumer.tsx      # LEGACY - old single-step flow

components/onboarding/vigil/
└── VigilMultiStepOnboarding.tsx       # Vigil wrapper

src/types/
└── multiStepOnboard.types.ts          # Type definitions

app/(consumer)/onboard-v2/
└── page.tsx                           # Consumer onboarding page

app/vigil/onboard-v2/
└── page.tsx                           # Vigil onboarding page

app/(consumer)/onboard/                # OLD FLOW - still active
app/vigil/onboard/                     # OLD FLOW - still active
```

---

## UI/UX Patterns

### Role-Based Theming
- **Consumer**: Blue theme (`bg-blue-600`, `text-blue-600`, etc.)
- **Vigil**: Orange theme (`bg-vigilOrange-500`, `text-vigilOrange-500`, etc.)

### Progress Tracking
```typescript
const progress = ((currentStepIndex + 1) / totalSteps) * 100;
```
Display: `[████████░░░░░░░░░░] 40% - Passo 3 di 7`

### Error Handling
- Per-field validation errors displayed below inputs
- Global error banner for submission failures
- Loading states during submission
- Toast notifications for success/error

### Navigation
- "Indietro" (Back): Returns to previous visited step, preserves answers
- "Avanti" (Next): Validates and moves to next step
- "Completa" (Complete): Shown on final step, triggers submission

---

## Integration Points

### Services
- `OnboardService.update()`: Saves onboarding data
- `AuthService.renewAuthentication()`: Refreshes session after onboarding
- `useUserStore.getUserDetails()`: Updates user state

### Routing
- `Routes.home.url`: Post-completion redirect
- `/onboard-v2`: New consumer flow
- `/vigil/onboard-v2`: New vigil flow
- `/onboard`, `/vigil/onboard`: Old flows (still active)

### State Management
- `useUserStore`: User profile data
- `useAppStore.showToast()`: Toast notifications

---

## Validation System

### React Hook Form Integration
- Form validation via Controller's `rules` prop
- Per-step validation: `trigger(questionIds)`
- Error object: `errors[questionId]?.message`

### Validation Flow
1. Schema defined in `question.validation`
2. React Hook Form applies rules
3. User input validated on change/blur
4. Errors displayed below fields
5. Submit blocked if validation fails

### Custom Validation
```typescript
validation: {
  validate: (value) => {
    if (condition) return "Error message";
    return true; // Valid
  }
}
```

---

This reference document provides the complete technical foundation for understanding and working with the multi-step onboarding system. For consumer flow details, see [onboarding-consumer-flow.md](./onboarding-consumer-flow.md). For vigil flow details, see [onboarding-vigil-flow.md](./onboarding-vigil-flow.md). For usage examples and customization, see [onboarding-guide.md](./onboarding-guide.md).
