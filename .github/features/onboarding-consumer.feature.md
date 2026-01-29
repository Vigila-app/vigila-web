# Consumer Onboarding Feature Documentation

## Overview

The Consumer Onboarding feature is a multi-step form system that guides new consumer users through the registration and profile completion process. It's designed to collect essential information about the consumer and the person they care for, enabling a personalized caregiving marketplace experience.

The system uses a flexible, step-based architecture that supports conditional logic, allowing different users to follow different paths based on their answers.

---

## Architecture

### Core Components

#### 1. **ConsumerMultiStepOnboarding** (`components/onboarding/consumer/ConsumerMultiStepOnboarding.tsx`)
- **Purpose**: Main entry point for the new consumer onboarding flow
- **Responsibilities**:
  - Manages form submission and data processing
  - Coordinates with `OnboardService` to save data to the backend
  - Triggers authentication renewal after successful completion
  - Displays success/error toasts via `useAppStore`
  - Redirects to onboard complete page on successful completion
  - Extracts postal code/CAP from address object

#### 2. **MultiStepOnboarding** (`components/onboarding/multiStep/MultiStepOnboarding.tsx`)
- **Purpose**: Generic multi-step onboarding framework
- **Key Features**:
  - Manages step progression and navigation (forward/backward)
  - Tracks visited steps for proper back button functionality
  - Calculates progress percentage
  - Handles form validation per step
  - Supports conditional step routing based on answers
  - Manages loading state during submission
  - Maintains state via `useState` (answers, currentStep, visitedSteps)
- **Key Methods**:
  - `handleNext()`: Validates current step and moves to next step or completes onboarding
  - `handleBack()`: Returns to previous visited step
  - `getNextStepId()`: Determines next step using step-level or question-level nextStep logic

#### 3. **QuestionRenderer** (`components/onboarding/multiStep/QuestionRenderer.tsx`)
- **Purpose**: Renders individual questions based on type
- **Supported Question Types**:
  - `TEXT`: Simple text input
  - `EMAIL`: Email validation input
  - `PHONE`: Phone number input
  - `NUMBER`: Numeric input
  - `DATE`: Date picker
  - `TEXTAREA`: Multi-line text input
  - `SELECT`: Single-select dropdown
  - `SELECT_MULTI`: Multi-select dropdown with search
  - `RADIO`: Radio button group
  - `CHECKBOX`: Single checkbox
  - `MULTI_CHECKBOX`: Multiple checkboxes
  - `CARD`: Card-based selection
  - `ADDRESS`: Address search with autocomplete
  - `MULTI_ADDRESS`: Multiple address entries
  - `FILE`: File upload
  - `AVAILABILITIES`: Calendar/availability picker
- **Handles**: Type-specific validation and UI rendering

#### 4. **Legacy Component: onboardComponent_Consumer** (`components/onboarding/consumer/onboardComponent_Consumer.tsx`)
- **Status**: Legacy implementation
- **Note**: Still in codebase but superseded by new multi-step system
- **Handles**: Basic consumer onboarding without step-based flow

---

## Data Flow

### 1. Configuration Phase
```
createConsumerOnboardingConfig()
    ↓
Returns OnboardingConfig with:
  - role: RolesEnum.CONSUMER
  - steps: Array of OnboardingStep
  - initialStepId: Starting step ID
  - onComplete: Callback handler
```

### 2. User Input Phase
```
MultiStepOnboarding Component
    ↓
Renders current step questions
    ↓
QuestionRenderer renders each question
    ↓
User answers question
    ↓
React Hook Form captures value via Controller
```

### 3. Navigation Phase
```
User clicks "Avanti" (Next)
    ↓
Current step validation triggered
    ↓
If invalid: Show errors, stay on step
    ↓
If valid: Calculate next step ID
    ↓
Update state with answers
    ↓
Re-render with new step
```

### 4. Submission Phase
```
User completes final step
    ↓
handleNext() detects no nextStepId
    ↓
onComplete() callback invoked with all answers
    ↓
OnboardService.update() saves data to backend
    ↓
AuthService.renewAuthentication() refreshes session
    ↓
getUserDetails() updates user store
    ↓
Router redirects to home
```

---

## Database Integration

### Tables Involved

#### `consumers` table
- Primary consumer profile information
- Fields populated during onboarding:
  - `displayName`: User's name
  - `lovedOneName`: Loved one's name
  - `relationship`: Relationship to loved one
  - `lovedOneBirthday`: Loved one's birthday
  - `lovedOnePhone`: Loved one's contact phone (this may be a legacy field)
  - `address`: Address as JSONB
  - `cap`: Postal code
  - `information`: Additional information/notes

#### `consumers-data` table (Extension)
- Onboarding-specific details that extend the consumers table
- **Foreign Key**: `consumer_id` → `consumers.id`
- Fields populated during onboarding:
  - `autonomy`: Loved one's autonomy level (text)
  - `needs`: Array of care needs (text[])
  - `gender-preference`: Caregiver gender preference (text)
  - `attitude`: Personality traits/attitudes (text[])
  - `qualificatios`: Special qualifications needed (text)
  - `transportation`: Transportation requirements (text)
  - `experience`: Required experience level (text)

---

## Configuration Structure

The onboarding flow is configured via `createConsumerOnboardingConfig()` which returns:

```typescript
interface OnboardingConfig {
  role: RolesEnum;
  steps: OnboardingStep[];
  initialStepId: string;
  onComplete: (data: Record<string, any>) => Promise<void>;
}

interface OnboardingStep {
  id: string;
  title: string;
  description?: string;
  questions: OnboardingQuestion[];
  nextStep?: string | ((answers: Record<string, any>) => string | null);
}

interface OnboardingQuestion {
  id: string;
  type: QuestionType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    validate?: (value: any) => boolean | string;
  };
  nextStep?: string | ((answer: any, allAnswers: Record<string, any>) => string | null);
}
```

---

## Conditional Logic

The system supports two levels of conditional step routing:

### Step-Level Conditional
```typescript
nextStep: (answers: Record<string, any>) => string | null
```
- Evaluated after completing all questions in a step
- Determines which step to navigate to based on overall step answers

### Question-Level Conditional
```typescript
nextStep: (answer: any, allAnswers: Record<string, any>) => string | null
```
- Evaluated for individual question answers
- Takes precedence over step-level routing
- Useful for skipping steps based on specific question responses

---

## State Management

### Component State
```typescript
interface OnboardingFlowState {
  currentStepId: string;           // Current step being displayed
  currentStepIndex: number;         // Position in steps array
  answers: Record<string, any>;     // All collected answers
  visitedSteps: string[];          // History of visited steps (for back button)
  isLoading: boolean;              // Submission in progress
  error?: string;                  // Error message if any
}
```

### User Store Integration
- `useUserStore.getUserDetails()`: Refreshes user info after onboarding
- Triggers authentication renewal

### App Store Integration
- `useAppStore.showToast()`: Displays success/error messages

---

## Form Validation

### Validation Flow
1. **Schema Definition**: Validation rules defined in `OnboardingQuestion.validation`
2. **React Hook Form**: Implements validation via Controller's `rules` prop
3. **Per-Step Validation**: `trigger()` validates only current step's questions
4. **Error Display**: `errors` object from form state displays validation messages
5. **Submit Prevention**: Form submission blocked if validation fails

### Validation Types Supported
- `required`: Field must be filled
- `minLength`/`maxLength`: String length constraints
- `min`/`max`: Numeric range constraints
- `pattern`: Regex pattern matching
- `validate`: Custom validation function

---

## User Experience Flow

1. **Entry Point**: User navigates to onboarding after sign-up
2. **Step 1**: Initial information (loved one name, age, birthday, phone)
3. **Conditional Steps**: Depending on answers, user may skip certain steps
4. **Address Step**: Search and select address with autocomplete
5. **Details Step**: Additional information about needs, preferences, etc.
6. **Review/Submit**: Final step or direct submission
7. **Success**: Profile saved, user redirected to home
8. **Error Handling**: Toast messages for both success and errors

---

## Integration Points

### API Service
- **OnboardService.update()**: Saves onboarding data to backend
- Takes role and data payload
- Returns confirmation or error

### Authentication
- **AuthService.renewAuthentication()**: Refreshes user session after onboarding
- Ensures new data is reflected in authenticated state

### Routing
- **Routes.home.url**: Post-completion redirect destination

---

## Address Handling

The system includes special address handling:

```typescript
// Address object structure expected
{
  address: {
    postcode?: string;
    postalCode?: string;
    cap?: string;
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    county?: string;
  };
  display_name?: string;
}

// CAP extraction logic (in order of preference)
cap = address?.address?.postcode || 
      address?.address?.postalCode || 
      address?.address?.cap || 
      ""
```

---

## Error Handling

### Submission Errors
- Caught in `handleComplete()` try-catch block
- Error message displayed via toast
- Error logged to console
- Error state updated in onboarding component
- Error displayed to user in red alert box

### Validation Errors
- Triggered per-step via `trigger(questionIds)`
- Prevents navigation to next step
- Individual field errors displayed below inputs
- Managed by React Hook Form

---

## Related Files

- **Service**: `src/services/onboard.service.ts`
- **Store**: `src/store/user/user.store.ts`, `src/store/app/app.store.ts`
- **Types**: `src/types/multiStepOnboard.types.ts`
- **Configuration**: `components/onboarding/multiStep/consumerOnboardingConfig.ts`
- **Form Components**: `components/form/*`
- **Database Schema**: `.github/database/schema.database.md`
