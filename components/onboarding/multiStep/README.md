# Multi-Step Onboarding System

This directory contains the new multi-step onboarding flow for Vigila, designed to replace the simple single-step onboarding process.

## Overview

The multi-step onboarding system provides a flexible, tree-based flow where each step can contain multiple questions, and the next step is determined dynamically based on user answers.

## Components

### Core Components

1. **MultiStepOnboarding** (`MultiStepOnboarding.tsx`)
   - Main orchestrator component
   - Manages flow state, navigation, and form validation
   - Handles progress tracking and error states
   - Collects all answers and sends them in a single API call on completion

2. **QuestionRenderer** (`QuestionRenderer.tsx`)
   - Renders individual questions based on their type
   - Supports: text, number, date, email, phone, textarea, select, radio, checkbox, multi-checkbox, and address
   - Uses existing form components (Input, TextArea, Checkbox, Select, SearchAddress)

### Configuration Files

3. **consumerOnboardingConfig.ts**
   - Defines the onboarding flow for CONSUMER users
   - Example conditional branching: different path for "Badante" relationship
   - Steps: welcome → age-info → contact-info → relationship → [conditional: professional-details] → address → additional-info

4. **vigilOnboardingConfig.ts**
   - Defines the onboarding flow for VIGIL users
   - Example conditional branching based on:
     - Occupation (professional documentation requirements)
     - Transportation (wider vs. local service area)
   - Steps: welcome → contact → occupation → [conditional: professional-docs-info] → experience → transportation → [conditional: service-area-wide/local] → address

### Wrapper Components

5. **ConsumerMultiStepOnboarding.tsx**
   - Wrapper for Consumer onboarding
   - Handles API integration and navigation

6. **VigilMultiStepOnboarding.tsx**
   - Wrapper for Vigil onboarding
   - Handles API integration and navigation

## Type System

### Key Types (`src/types/multiStepOnboard.types.ts`)

- `QuestionType`: Enum of supported question types
- `ValidationRules`: Validation configuration for questions
- `OnboardingQuestion`: Single question definition
- `OnboardingStep`: Step containing one or more questions
- `OnboardingFlowConfig`: Complete flow configuration
- `OnboardingFlowState`: Current state of the flow

## Usage

### Basic Usage

```tsx
import MultiStepOnboarding from "@/components/onboarding/multiStep/MultiStepOnboarding";
import { createConsumerOnboardingConfig } from "@/components/onboarding/multiStep/consumerOnboardingConfig";

const MyOnboardingPage = () => {
  const handleComplete = async (data: Record<string, any>) => {
    // Process and submit data
    await OnboardService.update({
      role: RolesEnum.CONSUMER,
      data: transformedData,
    });
  };

  const config = createConsumerOnboardingConfig(handleComplete);

  return <MultiStepOnboarding config={config} />;
};
```

### Creating Custom Flows

#### 1. Define Your Steps

```typescript
const steps: OnboardingStep[] = [
  {
    id: "step1",
    title: "Welcome",
    description: "Let's get started",
    questions: [
      {
        id: "name",
        type: QuestionType.TEXT,
        label: "What's your name?",
        validation: { required: true },
        autoFocus: true,
      },
    ],
    nextStep: "step2", // Static next step
  },
  {
    id: "step2",
    title: "Details",
    questions: [
      {
        id: "role",
        type: QuestionType.RADIO,
        label: "Select your role",
        options: [
          { label: "Student", value: "student" },
          { label: "Professional", value: "professional" },
        ],
        validation: { required: true },
      },
    ],
    // Dynamic next step based on answer
    nextStep: (answers) => {
      return answers.role === "student" ? "student-info" : "professional-info";
    },
  },
];
```

#### 2. Create Flow Configuration

```typescript
const config: OnboardingFlowConfig = {
  role: RolesEnum.CONSUMER,
  initialStepId: "step1",
  steps,
  onComplete: handleComplete,
};
```

### Conditional Logic

The system supports conditional branching at two levels:

#### Question-Level Routing
```typescript
{
  id: "myQuestion",
  type: QuestionType.SELECT,
  label: "Choose option",
  nextStep: (answer, allAnswers) => {
    if (answer === "option1") return "path-a";
    return "path-b";
  }
}
```

#### Step-Level Routing
```typescript
{
  id: "myStep",
  questions: [...],
  nextStep: (allAnswers) => {
    if (allAnswers.someField === "value") return "next-step-a";
    return "next-step-b";
  }
}
```

## Question Types

### Supported Types

- `TEXT`: Basic text input
- `EMAIL`: Email input with validation
- `PHONE`: Phone number input
- `NUMBER`: Numeric input with min/max
- `DATE`: Date picker
- `TEXTAREA`: Multi-line text area
- `SELECT`: Dropdown selection
- `RADIO`: Single choice from options
- `CHECKBOX`: Single boolean checkbox
- `MULTI_CHECKBOX`: Multiple checkbox selections
- `ADDRESS`: Address search with autocomplete

### Validation Options

```typescript
validation: {
  required: boolean,
  minLength: number,
  maxLength: number,
  min: number | string,  // for numbers or dates
  max: number | string,  // for numbers or dates
  pattern: RegExp,
  validate: (value: any) => boolean | string
}
```

## API Integration

All answers are collected throughout the flow and sent in a **single POST request** when the user completes the onboarding. This is handled by the `onComplete` callback in the configuration.

```typescript
const onComplete = async (data: Record<string, any>) => {
  // Transform data as needed
  const transformedData = {
    field1: data.question1,
    field2: data.question2,
    // ...
  };

  // Single API call
  await OnboardService.update({
    role: RolesEnum.CONSUMER,
    data: transformedData,
  });
};
```

## Pages

### Demo Pages

- **Consumer**: `/onboard-v2` (Consumer layout)
- **Vigil**: `/vigil/onboard-v2`

These pages demonstrate the new multi-step flow alongside the existing single-step onboarding at `/onboard` and `/vigil/onboard`.

## Migration Strategy

The new system is designed for progressive migration:

1. ✅ New files created without modifying existing ones
2. ✅ Old onboarding components remain at `/onboard`
3. ✅ New onboarding accessible at `/onboard-v2`
4. 🔄 Test and validate new flows
5. 🔄 Gradually migrate users to new flow
6. 🔄 Eventually replace old flow

## Features

- ✅ Dynamic, tree-based flow with conditional branching
- ✅ Progress bar showing completion percentage
- ✅ Form validation with error messages
- ✅ Back navigation support
- ✅ All existing form components reused
- ✅ Single API call on completion
- ✅ Loading states and error handling
- ✅ Responsive design with role-based styling
- ✅ Type-safe configuration

## Future Enhancements

Potential improvements for the future:

- [ ] Skip/optional steps
- [ ] Save progress and resume later
- [ ] A/B testing different flows
- [ ] Analytics integration for drop-off tracking
- [ ] Multi-language support
- [ ] Custom validation messages per question
- [ ] File upload question type
- [ ] Step animations and transitions
