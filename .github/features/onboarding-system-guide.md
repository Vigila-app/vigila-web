# Multi-Step Onboarding System - Complete Guide

> **Purpose**: Comprehensive technical reference and development guide for Vigila's multi-step onboarding system. Covers architecture, components, types, implementation patterns, and practical usage.

## Quick Reference

**Core Orchestrator**: [MultiStepOnboarding.tsx](../../components/onboarding/multiStep/MultiStepOnboarding.tsx) (286 lines)  
**Question Renderer**: [QuestionRenderer.tsx](../../components/onboarding/multiStep/QuestionRenderer.tsx) (240 lines)  
**Type System**: [onboarding.types.ts](../../src/types/onboarding.types.ts)  
**Consumer Config**: [consumerOnboardingConfig.ts](../../components/onboarding/multiStep/consumerOnboardingConfig.ts) (427 lines)  
**Vigil Config**: [vigilOnboardingConfig.ts](../../components/onboarding/multiStep/vigilOnboardingConfig.ts) (513 lines)

**Pattern**: Config-driven, conditional routing, single API submission

---

## Table of Contents

### Part I: Architecture & Components
- [System Architecture](#system-architecture)
- [Core Components](#core-components)
- [Type System](#type-system)
- [Question Types Reference](#question-types-reference)
- [Data Flow](#data-flow)
- [Database Integration](#database-integration)

### Part II: Development Guide
- [Quick Start](#quick-start)
- [Creating Custom Flows](#creating-custom-flows)
- [Adding/Modifying Steps](#addingmodifying-steps)
- [Custom Question Types](#custom-question-types)
- [Testing Guide](#testing-guide)
- [Migration Strategy](#migration-strategy)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

# Part I: Architecture & Components

## System Architecture

### Overview
Tree-based onboarding system supporting multi-role flows (CONSUMER, VIGIL) through separate configurations.

**Key Features**:
- **Configuration-driven**: Flows defined in config files, not hardcoded
- **Conditional Routing**: Next step determined by user answers (question-level or step-level)
- **Single Submission**: All data collected and sent in one API call
- **Type-safe**: Full TypeScript coverage with comprehensive type definitions

### Architectural Principles
1. **Separation of Concerns**: Logic (orchestrator) separate from rendering (question renderer)
2. **Composition**: Generic components reused via configuration
3. **Declarative**: Flow declared through config, not imperative
4. **Validation First**: React Hook Form for form-level validation + custom validators
5. **State Immutability**: State updates via React setState patterns

### Flow Pattern
```
Config File (vigilOnboardingConfig.ts / consumerOnboardingConfig.ts)
    ↓ Defines steps, questions, routing
Wrapper Component (VigilMultiStepOnboarding / ConsumerMultiStepOnboarding)
    ↓ Data transformation, API integration
MultiStepOnboarding (Generic Orchestrator)
    ↓ State management, navigation, validation
QuestionRenderer (Question-specific rendering)
    ↓ Renders inputs via React Hook Form Controller
Form Components (Input, Select, Checkbox, etc.)
    ↓ UI primitives
User Input → Validation → Next Step → ... → Complete → API Call
```

---

## Core Components

### 1. MultiStepOnboarding.tsx
**Generic orchestrator component** - 286 lines  
**Location**: `components/onboarding/multiStep/MultiStepOnboarding.tsx`

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

**Props**:
```typescript
interface MultiStepOnboardingProps {
  config: OnboardingFlowConfig;    // Flow configuration
  initialData?: Record<string, any>; // Pre-populate answers
  onComplete: (data: Record<string, any>) => Promise<void>; // Completion handler
}
```

### 2. QuestionRenderer.tsx
**Universal question renderer** - 240 lines  
**Location**: `components/onboarding/multiStep/QuestionRenderer.tsx`

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

**Props**:
```typescript
interface QuestionRendererProps {
  question: OnboardingQuestion;
  control: Control<any>;           // React Hook Form control
  errors: FieldErrors;             // Validation errors
}
```

### 3. Configuration Factory Functions

Configurations generated by factory functions returning `OnboardingFlowConfig`:

```typescript
// consumerOnboardingConfig.ts
export const createConsumerOnboardingConfig = (): OnboardingFlowConfig => ({
  flowId: "consumer-v2",
  role: "CONSUMER",
  steps: [...], // 11 steps
});

// vigilOnboardingConfig.ts  
export const createVigilOnboardingConfig = (): OnboardingFlowConfig => ({
  flowId: "vigil-v2",
  role: "VIGIL",
  steps: [...], // 20 steps
});
```

**Factory Pattern Benefits**:
- **Encapsulation**: Config generation logic isolated
- **Testability**: Easy to mock configs for tests
- **Reusability**: Same pattern for N roles
- **Type Safety**: Guaranteed return type

### 4. Wrapper Components

Role-specific wrappers handle data transformation and API integration:

```typescript
// ConsumerMultiStepOnboarding.tsx
const ConsumerMultiStepOnboarding = () => {
  const config = createConsumerOnboardingConfig();
  
  const handleComplete = async (data: Record<string, any>) => {
    // Transform data
    const { address } = data;
    const cap = address?.address?.postcode || "";
    
    // Submit to API
    await OnboardService.update({
      ...data,
      cap,
      addresses: address ? [address] : []
    });
    
    // Post-submission actions
    await AuthService.renewAuthentication();
    useUserStore.getUserDetails();
    router.push(Routes.consumer.onboarding.complete.url);
  };

  return <MultiStepOnboarding config={config} onComplete={handleComplete} />;
};
```

---

## Type System

### Core Types
**Location**: `src/types/multiStepOnboard.types.ts`

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
  flowId: string;
  role: RolesEnum;
  steps: OnboardingStep[];
  initialStepId?: string;  // Defaults to first step
}
```

---

## Question Types Reference

### Basic Text Inputs

#### TEXT
Simple text input
```typescript
{
  id: "displayName",
  type: QuestionType.TEXT,
  label: "What's your name?",
  placeholder: "Enter your full name",
  validation: { required: true, maxLength: 100 }
}
```

#### TEXTAREA
Multi-line text input
```typescript
{
  id: "bio",
  type: QuestionType.TEXTAREA,
  label: "Tell us about yourself",
  placeholder: "Write a short bio...",
  validation: { maxLength: 400 }
}
```

#### EMAIL
Email input with validation
```typescript
{
  id: "email",
  type: QuestionType.EMAIL,
  label: "Email address",
  validation: { required: true }
}
```

#### PHONE
Phone number input
```typescript
{
  id: "phone",
  type: QuestionType.PHONE,
  label: "Phone number",
  validation: { required: true }
}
```

#### NUMBER
Numeric input
```typescript
{
  id: "age",
  type: QuestionType.NUMBER,
  label: "Age",
  validation: { required: true, min: 18, max: 99 }
}
```

#### DATE
Date picker
```typescript
{
  id: "birthday",
  type: QuestionType.DATE,
  label: "Date of birth",
  validation: { 
    required: true,
    validate: (value) => {
      const age = calculateAge(value);
      return age >= 18 && age <= 80 || "Must be between 18 and 80";
    }
  }
}
```

### Selection Inputs

#### SELECT
Single selection dropdown
```typescript
{
  id: "gender",
  type: QuestionType.SELECT,
  label: "Gender",
  options: [
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
    { label: "Other", value: "O" }
  ],
  validation: { required: true }
}
```

#### RADIO
Radio button group
```typescript
{
  id: "relationship",
  type: QuestionType.RADIO,
  label: "Your relationship",
  options: [
    { label: "Family member", value: "family" },
    { label: "Friend", value: "friend" },
    { label: "Professional", value: "professional" }
  ],
  validation: { required: true }
}
```

#### CARD
Card-based selection (visual choice)
```typescript
{
  id: "serviceType",
  type: QuestionType.CARD,
  label: "What service do you need?",
  options: [
    { 
      label: "Full-time care",
      value: "fulltime",
      icon: ClockIcon
    },
    {
      label: "Part-time care",
      value: "parttime",
      icon: CalendarIcon
    }
  ],
  validation: { required: true }
}
```

#### CHECKBOX
Single checkbox (boolean)
```typescript
{
  id: "language_confirmation",
  type: QuestionType.CHECKBOX,
  label: "I confirm I speak Italian fluently",
  validation: { required: true }
}
```

#### MULTI_CHECKBOX
Multiple checkbox selections
```typescript
{
  id: "services",
  type: QuestionType.MULTI_CHECKBOX,
  label: "Which services do you offer?",
  options: [
    { label: "Personal care", value: "personal" },
    { label: "Companionship", value: "companionship" },
    { label: "None", value: "none" }
  ],
  validation: { required: true }
}
```

### Special Inputs

#### ADDRESS
Address search with autocomplete
```typescript
{
  id: "address",
  type: QuestionType.ADDRESS,
  label: "Where do you live?",
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
  id: "propic",
  type: QuestionType.FILE,
  label: "Profile photo",
  validation: {
    required: true,
    file: {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedMimes: ["image/jpeg", "image/png", "image/webp"]
    }
  }
}
```

#### AVAILABILITIES
Weekly availability calendar
```typescript
{
  id: "availability",
  type: QuestionType.AVAILABILITIES,
  label: "When are you available?",
  validation: { required: true }
}
```

Returns object with day-keyed availability:
```typescript
{
  monday: { morning: true, afternoon: false, evening: true },
  tuesday: { morning: true, afternoon: true, evening: false },
  // ... other days
}
```

---

## Data Flow

### Collection Phase
```
Step 1 → Question answers saved to state
    ↓
Step 2 → More answers merged into state
    ↓
Step 3 → ...
    ↓
Final Step → All answers collected in flat object
```

### Conditional Routing

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

### Submission Phase
```
User clicks "Complete" on final step
    ↓
Wrapper's handleComplete() invoked with all answers
    ↓
Data transformation (extract CAP, format addresses, etc.)
    ↓
API call: OnboardService.update(transformedData)
    ↓
Post-submission actions:
  - AuthService.renewAuthentication()
  - useUserStore.getUserDetails()
  - Router redirect
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
Extended consumer information (1:1 relationship)
- **Foreign Key**: `consumer_id` → `consumers.id`
- `autonomy`: Loved one's autonomy level
- `healthConditions`: Medical conditions
- `mobility`: Mobility level
- `dietaryRestrictions`: Dietary needs
- `medication`: Medication info
- `attitude`: Preferred caregiver attitude
- `qualifications`: Required caregiver qualifications
- `transportation`: Required transportation
- `experience`: Required experience level

#### `vigils` table
Primary caregiver profile
- `displayName`: Caregiver's name
- `birthday`: Date of birth
- `gender`: M/F/O
- `phone`: Contact phone
- `addresses`: JSONB array of service addresses
- `cap`: Array of postal codes
- `information`: Bio/about section
- `zones`: Naples zones where available
- `transportation`: Available transportation
- `occupation`: Professional role
- `courses`: Training/certifications
- `years_of_experience`: Years in field
- `daily_activities`: Services offered (base care)
- `hygiene`: Hygiene services offered
- `outside`: Outdoor/escort services
- `past_exp`: Past experience with conditions
- `service_type`: Type of service offered
- `hours`: Desired weekly hours
- `urgent`: Availability for urgent requests
- `character`: Personality traits (max 3)
- `propic`: Profile photo URL

### Column Naming Convention
**CRITICAL**: Question IDs in config MUST exactly match Supabase column names.

Example:
```typescript
// Config
{ id: "displayName", type: QuestionType.TEXT, ... }

// Maps to
consumers.displayName
// or
vigils.displayName
```

---

# Part II: Development Guide

## Quick Start

### Using Existing Flows

#### Consumer Onboarding
```tsx
// app/(consumer)/onboard/page.tsx
import ConsumerMultiStepOnboarding from "@/components/onboarding/consumer/ConsumerMultiStepOnboarding";

export default function ConsumerOnboardPage() {
  return <ConsumerMultiStepOnboarding />;
}
```

**Routes**: `/onboard`

#### Vigil Onboarding
```tsx
// app/vigil/onboard/page.tsx
import VigilMultiStepOnboarding from "@/components/onboarding/vigil/VigilMultiStepOnboarding";

export default function VigilOnboardPage() {
  return <VigilMultiStepOnboarding />;
}
```

**Routes**: `/vigil/onboard`

---

## Creating Custom Flows

### Step 1: Define Your Config

Create a new config file: `components/onboarding/multiStep/myCustomConfig.ts`

```typescript
import { OnboardingFlowConfig, OnboardingStep, QuestionType } from "@/src/types/multiStepOnboard.types";
import { RolesEnum } from "@/src/enums/roles.enum";

export const createMyCustomConfig = (): OnboardingFlowConfig => {
  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome!",
      description: "Let's get started",
      questions: [
        {
          id: "name",
          type: QuestionType.TEXT,
          label: "What's your name?",
          validation: { required: true, maxLength: 100 },
          autoFocus: true
        }
      ],
      nextStep: "contact"
    },
    {
      id: "contact",
      title: "Contact Information",
      questions: [
        {
          id: "email",
          type: QuestionType.EMAIL,
          label: "Email address",
          validation: { required: true }
        },
        {
          id: "phone",
          type: QuestionType.PHONE,
          label: "Phone number",
          validation: { required: true }
        }
      ],
      nextStep: "preferences"
    },
    {
      id: "preferences",
      title: "Your Preferences",
      questions: [
        {
          id: "notifications",
          type: QuestionType.CHECKBOX,
          label: "Send me email notifications"
        }
      ],
      nextStep: null // null = final step
    }
  ];

  return {
    flowId: "my-custom-flow",
    role: RolesEnum.CONSUMER, // or VIGIL, or create new enum value
    steps,
    initialStepId: "welcome"
  };
};
```

### Step 2: Create Wrapper Component

```typescript
// components/onboarding/custom/MyCustomMultiStepOnboarding.tsx
import { useRouter } from "next/navigation";
import MultiStepOnboarding from "@/components/onboarding/multiStep/MultiStepOnboarding";
import { createMyCustomConfig } from "../multiStep/myCustomConfig";
import { MyService } from "@/src/services/myService";

const MyCustomMultiStepOnboarding = () => {
  const router = useRouter();
  const config = createMyCustomConfig();

  const handleComplete = async (data: Record<string, any>) => {
    try {
      // Transform data if needed
      const transformedData = {
        ...data,
        // Add computed fields
        completedAt: new Date().toISOString()
      };

      // Submit to API
      await MyService.create(transformedData);

      // Post-submission actions
      router.push("/success");
    } catch (error) {
      console.error("Submission failed:", error);
      throw error; // MultiStepOnboarding will handle display
    }
  };

  return (
    <MultiStepOnboarding
      config={config}
      onComplete={handleComplete}
    />
  );
};

export default MyCustomMultiStepOnboarding;
```

### Step 3: Add Page Route

```typescript
// app/my-flow/onboard/page.tsx
import MyCustomMultiStepOnboarding from "@/components/onboarding/custom/MyCustomMultiStepOnboarding";

export default function MyCustomOnboardPage() {
  return (
    <div className="container mx-auto py-8">
      <MyCustomMultiStepOnboarding />
    </div>
  );
}
```

---

## Adding/Modifying Steps

### Adding a New Step to Existing Flow

1. **Add step to config array**:
```typescript
// In vigilOnboardingConfig.ts or consumerOnboardingConfig.ts
{
  id: "new-step",
  title: "New Information",
  description: "Optional description",
  questions: [
    {
      id: "new_field",
      type: QuestionType.TEXT,
      label: "New question?",
      validation: { required: true }
    }
  ],
  nextStep: "next-existing-step" // or null for final step
}
```

2. **Update previous step's routing**:
```typescript
// Change previous step's nextStep
{
  id: "previous-step",
  // ...
  nextStep: "new-step" // Point to your new step
}
```

3. **Ensure database column exists**:
```sql
-- If new field doesn't exist in Supabase
ALTER TABLE consumers ADD COLUMN new_field TEXT;
-- or
ALTER TABLE vigils ADD COLUMN new_field TEXT;
```

### Modifying Existing Step

```typescript
// Find step by id and update
{
  id: "existing-step",
  title: "Updated Title",
  questions: [
    // Add new question
    {
      id: "additional_info",
      type: QuestionType.TEXTAREA,
      label: "Any additional information?",
      validation: { maxLength: 500 }
    },
    // Keep existing questions
    ...existingQuestions
  ],
  nextStep: "next-step"
}
```

### Removing a Step

1. **Update routing to skip step**:
```typescript
// Previous step should point to next step
{
  id: "before-removed",
  nextStep: "after-removed" // Skip the removed step
}
```

2. **Comment out or delete step** from config array

3. **Handle orphaned data**: Ensure removed step's question IDs aren't required elsewhere

---

## Custom Question Types

### Creating a New Question Type

If existing types don't meet your needs, extend the system:

#### 1. Add to QuestionType Enum
```typescript
// src/types/multiStepOnboard.types.ts
enum QuestionType {
  // ... existing types
  CUSTOM_RATING = "CUSTOM_RATING",
  CUSTOM_SLIDER = "CUSTOM_SLIDER"
}
```

#### 2. Create Custom Component
```typescript
// components/@core/form/CustomRatingInput.tsx
interface CustomRatingInputProps {
  value?: number;
  onChange: (value: number) => void;
  max?: number;
}

const CustomRatingInput: React.FC<CustomRatingInputProps> = ({
  value = 0,
  onChange,
  max = 5
}) => {
  return (
    <div className="flex gap-2">
      {Array.from({ length: max }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          className={`star ${value >= i + 1 ? "filled" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default CustomRatingInput;
```

#### 3. Add to QuestionRenderer
```typescript
// components/onboarding/multiStep/QuestionRenderer.tsx
import CustomRatingInput from "@/components/@core/form/CustomRatingInput";

// In render switch/if statement
if (question.type === QuestionType.CUSTOM_RATING) {
  return (
    <Controller
      name={question.id}
      control={control}
      rules={validationRules}
      render={({ field }) => (
        <div>
          <label>{question.label}</label>
          <CustomRatingInput
            value={field.value}
            onChange={field.onChange}
            max={question.max || 5}
          />
          {errors[question.id] && (
            <span className="error">{errors[question.id].message}</span>
          )}
        </div>
      )}
    />
  );
}
```

#### 4. Use in Config
```typescript
{
  id: "satisfaction",
  type: QuestionType.CUSTOM_RATING,
  label: "Rate your satisfaction",
  max: 5,
  validation: { required: true }
}
```

---

## Testing Guide

### Manual Testing Checklist

#### Flow Completeness
- [ ] Can navigate through all steps in sequence
- [ ] Back button works correctly
- [ ] Progress bar updates accurately
- [ ] All questions render correctly
- [ ] Validation errors display properly
- [ ] Can complete flow and reach success page

#### Validation Testing
- [ ] Required fields prevent advancement when empty
- [ ] MaxLength validation works
- [ ] Min/Max values enforced for numbers/dates
- [ ] Email validation accepts valid emails only
- [ ] Phone validation works
- [ ] File upload rejects invalid types/sizes
- [ ] Custom validators execute correctly

#### Conditional Logic Testing
- [ ] Question-level routing works (when answer triggers specific next step)
- [ ] Step-level routing works
- [ ] Correct steps shown/skipped based on answers
- [ ] Back navigation works with conditional routing

#### Data Persistence
- [ ] All answers saved correctly to state
- [ ] Data submitted to correct API endpoint
- [ ] Database columns populated correctly
- [ ] Files uploaded to storage successfully
- [ ] Post-submission redirects work

### Automated Testing

#### Unit Tests Example
```typescript
// __tests__/onboarding/vigilOnboardingConfig.test.ts
import { createVigilOnboardingConfig } from "@/components/onboarding/multiStep/vigilOnboardingConfig";

describe("Vigil Onboarding Config", () => {
  it("should have 20 steps", () => {
    const config = createVigilOnboardingConfig();
    expect(config.steps).toHaveLength(20);
  });

  it("should start with welcome step", () => {
    const config = createVigilOnboardingConfig();
    expect(config.steps[0].id).toBe("welcome");
  });

  it("should route professionals to docs acknowledgment", () => {
    const config = createVigilOnboardingConfig();
    const occupationStep = config.steps.find(s => s.id === "occupation");
    const nextStep = occupationStep?.nextStep as Function;
    
    expect(nextStep({ occupation: "PROFESSIONAL" })).toBe("professional_docs_info");
    expect(nextStep({ occupation: "OTHER" })).toBe("courses");
  });
});
```

#### Integration Tests Example
```typescript
// __tests__/onboarding/MultiStepOnboarding.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import MultiStepOnboarding from "@/components/onboarding/multiStep/MultiStepOnboarding";

const mockConfig = {
  flowId: "test-flow",
  role: "CONSUMER",
  steps: [
    {
      id: "step1",
      title: "Step 1",
      questions: [{ id: "name", type: "TEXT", label: "Name", validation: { required: true } }],
      nextStep: "step2"
    },
    {
      id: "step2",
      title: "Step 2",
      questions: [{ id: "email", type: "EMAIL", label: "Email" }],
      nextStep: null
    }
  ]
};

describe("MultiStepOnboarding", () => {
  it("should render first step", () => {
    render(<MultiStepOnboarding config={mockConfig} onComplete={async () => {}} />);
    expect(screen.getByText("Step 1")).toBeInTheDocument();
  });

  it("should not advance without required field", async () => {
    render(<MultiStepOnboarding config={mockConfig} onComplete={async () => {}} />);
    const nextButton = screen.getByText("Avanti");
    fireEvent.click(nextButton);
    
    // Should still be on step 1
    expect(screen.getByText("Step 1")).toBeInTheDocument();
  });

  it("should advance when field is filled", async () => {
    render(<MultiStepOnboarding config={mockConfig} onComplete={async () => {}} />);
    
    const input = screen.getByLabelText("Name");
    fireEvent.change(input, { target: { value: "John Doe" } });
    
    const nextButton = screen.getByText("Avanti");
    fireEvent.click(nextButton);
    
    // Should advance to step 2
    expect(await screen.findByText("Step 2")).toBeInTheDocument();
  });
});
```

---

## Migration Strategy

### Coexistence Pattern
New system is now the standard implementation:

```
STANDARD ROUTES:
- /onboard (consumer)
- /vigil/onboard (vigil)
```

### Gradual Migration Steps

#### Phase 1: Soft Launch
- Deploy new routes
- Link to new flow from settings/profile
- Monitor errors, collect feedback
- Keep old flow as default

#### Phase 2: A/B Testing
- Randomly route 50% users to new flow
- Compare completion rates
- Fix issues found

#### Phase 3: Full Migration
- Make new flow default
- Redirect old routes to new routes
- Keep old flow accessible via query param for fallback



#### Phase 4: Deprecation
- Remove old onboarding components
- Remove old routes
- Update all internal links

---

## Troubleshooting

### Common Issues

#### Issue: "Cannot advance to next step"
**Cause**: Validation failing or nextStep misconfigured  
**Fix**:
1. Check browser console for validation errors
2. Verify all required fields have values
3. Check `nextStep` function logic
4. Ensure next step ID exists in config

#### Issue: "Data not saving to database"
**Cause**: Question ID doesn't match column name  
**Fix**:
1. Verify question `id` exactly matches Supabase column name
2. Check column exists: `SELECT * FROM information_schema.columns WHERE table_name = 'consumers'`
3. Ensure column type matches question type

#### Issue: "Conditional routing not working"
**Cause**: Question-level and step-level routing conflict  
**Fix**:
- Question-level `nextStep` takes precedence
- If question has `nextStep` returning non-null, step-level is ignored
- Return `null` from question-level to fall back to step-level

#### Issue: "Back button shows wrong step"
**Cause**: Conditional routing bypassed a step  
**Fix**:
- This is expected behavior - back follows visited path
- `visitedSteps` array tracks actual path taken
- If step was skipped, it won't be in back navigation

#### Issue: "File upload fails"
**Cause**: File size or MIME type validation  
**Fix**:
1. Check `file.maxSize` in validation rules
2. Verify `file.allowedMimes` includes file type
3. Check Supabase storage bucket permissions
4. Verify storage bucket exists

#### Issue: "Progress bar incorrect"
**Cause**: Conditional steps not accounted for  
**Fix**:
- Progress based on total steps in config
- With conditional routing, progress may jump
- Consider calculating progress based on visited steps instead

---

## Best Practices

### Configuration Design

#### ✅ DO:
- Keep question IDs matching database columns exactly
- Use descriptive step IDs (e.g., "contact-info" not "step2")
- Group related questions in same step (max 3-4 questions)
- Use question-level routing sparingly (only when answer directly determines path)
- Provide helpful placeholders and descriptions
- Set reasonable validation limits

#### ❌ DON'T:
- Don't create steps with 10+ questions (split into multiple steps)
- Don't use generic IDs like "question1"
- Don't create circular routing (infinite loops)
- Don't forget to handle null/undefined in conditional functions
- Don't skip validation - always validate user input

### Component Organization

```
components/onboarding/
├── multiStep/              # Generic system
│   ├── MultiStepOnboarding.tsx
│   ├── QuestionRenderer.tsx
│   ├── consumerOnboardingConfig.ts
│   └── vigilOnboardingConfig.ts
├── consumer/               # Consumer-specific wrapper
│   └── ConsumerMultiStepOnboarding.tsx
├── vigil/                  # Vigil-specific wrapper
│   └── VigilMultiStepOnboarding.tsx
└── @core/                  # Reusable form components
    └── form/
```

### Validation Best Practices

1. **Always validate required fields**: `validation: { required: true }`
2. **Set reasonable limits**: `maxLength: 500` not `maxLength: 10000`
3. **Use custom validators for complex logic**:
```typescript
validate: (value) => {
  if (complexCondition(value)) return "Error message";
  return true;
}
```
4. **Provide clear error messages**: "Must be at least 18 years old" not "Invalid"

### Performance Optimization

1. **Lazy load wrapper components**:
```typescript
const ConsumerMultiStepOnboarding = dynamic(
  () => import("@/components/onboarding/consumer/ConsumerMultiStepOnboarding"),
  { ssr: false }
);
```

2. **Memoize config creation**:
```typescript
const config = useMemo(() => createVigilOnboardingConfig(), []);
```

3. **Debounce expensive validation**:
```typescript
validation: {
  validate: debounce(async (value) => {
    const isValid = await checkAvailability(value);
    return isValid || "Already taken";
  }, 500)
}
```

---

**Last Updated**: February 2, 2026  
**Version**: 2.0 (Multi-step system)
